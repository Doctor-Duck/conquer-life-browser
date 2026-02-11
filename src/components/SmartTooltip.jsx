import React, { useRef, useEffect, useState, useLayoutEffect } from "react";

export function SmartTooltip({ children, content, visible }) {
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ placement: "top", offsetX: 0, arrowOffset: 0 });

  useLayoutEffect(() => {
    if (!visible || !tooltipRef.current || !containerRef.current) {
      // Reset position when hidden
      if (!visible) {
        setPosition({ placement: "top", offsetX: 0, arrowOffset: 0 });
      }
      return;
    }

    const tooltip = tooltipRef.current;
    const container = containerRef.current;
    
    // Find the actual hovered element (first child element, not text nodes)
    const hoveredElement = Array.from(container.childNodes).find(
      (node) => node.nodeType === Node.ELEMENT_NODE && node !== tooltip
    );
    
    if (!hoveredElement) {
      return;
    }
    
    // Force a reflow to get accurate measurements
    tooltip.style.visibility = "hidden";
    tooltip.style.display = "block";
    
    // Get bounding boxes
    const tooltipRect = tooltip.getBoundingClientRect();
    const hoveredRect = hoveredElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate available space based on hovered element
    const spaceAbove = hoveredRect.top;
    const spaceBelow = viewportHeight - hoveredRect.bottom;
    const tooltipHeight = tooltipRect.height;
    const tooltipWidth = tooltipRect.width;

    // Determine vertical placement
    let placement = "top";
    const minSpace = tooltipHeight + 20;
    if (spaceAbove < minSpace && spaceBelow > spaceAbove) {
      placement = "bottom";
    }

    // Calculate horizontal positioning based on hovered element center
    const hoveredCenterX = hoveredRect.left + hoveredRect.width / 2;
    const containerRect = container.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    
    // Calculate offset needed to center tooltip on hovered element
    // Then adjust for viewport boundaries
    let offsetX = hoveredCenterX - containerCenterX;
    
    // Check viewport boundaries
    const tooltipCenterX = containerCenterX + offsetX;
    const leftEdge = tooltipCenterX - tooltipWidth / 2;
    const rightEdge = tooltipCenterX + tooltipWidth / 2;
    
    if (leftEdge < 10) {
      // Too far left, shift right
      offsetX = 10 + tooltipWidth / 2 - containerCenterX;
    } else if (rightEdge > viewportWidth - 10) {
      // Too far right, shift left
      offsetX = (viewportWidth - 10) - tooltipWidth / 2 - containerCenterX;
    }

    // Check against scrollable parent containers
    let scrollableParent = hoveredElement.parentElement;
    while (scrollableParent) {
      const parentStyle = window.getComputedStyle(scrollableParent);
      const isScrollable = 
        parentStyle.overflow === "auto" || 
        parentStyle.overflow === "scroll" ||
        parentStyle.overflowY === "auto" ||
        parentStyle.overflowY === "scroll";
      
      if (isScrollable) {
        const parentRect = scrollableParent.getBoundingClientRect();
        const parentLeft = parentRect.left;
        const parentRight = parentRect.right;
        
        // Recalculate tooltip center with current offset
        const currentTooltipCenterX = containerCenterX + offsetX;
        const adjustedLeft = currentTooltipCenterX - tooltipWidth / 2;
        const adjustedRight = currentTooltipCenterX + tooltipWidth / 2;
        
        if (adjustedLeft < parentLeft + 10) {
          offsetX = parentLeft + 10 + tooltipWidth / 2 - containerCenterX;
        } else if (adjustedRight > parentRight - 10) {
          offsetX = (parentRight - 10) - tooltipWidth / 2 - containerCenterX;
        }
        break;
      }
      
      scrollableParent = scrollableParent.parentElement;
    }
    
    // Calculate arrow offset: tooltip center relative to hovered element center
    // Tooltip is positioned at container center + offsetX
    const finalTooltipCenterX = containerCenterX + offsetX;
    
    // Arrow should point to hovered element center
    // Arrow is positioned at 50% of tooltip, so we need to offset it
    const arrowOffset = hoveredCenterX - finalTooltipCenterX;

    setPosition({ placement, offsetX, arrowOffset });
    
    // Make tooltip visible again
    tooltip.style.visibility = "visible";
  }, [visible, content]);

  return (
    <span ref={containerRef} className="tooltip-container">
      {children}
      {visible && content && (
        <div
          ref={tooltipRef}
          className={`travel-opportunity-tooltip tooltip-${position.placement}`}
          style={{
            transform: `translateX(calc(-50% + ${position.offsetX}px))`,
            "--arrow-offset": `${position.arrowOffset || 0}px`,
          }}
        >
          {content}
        </div>
      )}
    </span>
  );
}
