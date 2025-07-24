var irToplanogramModule = (function ($, ksAPI) {
  
  function createPlanogram(skuList, options = {}) {


    console.log("hey there");

    // Default options
    const config = {
      fixtureHeight: options.fixtureHeight || 40, // Height per shelf level in pixels
      scale: options.scale || 2, // Scale factor for product dimensions
      containerWidth: options.containerWidth || 800,
      onFacingDelete: options.onFacingDelete || null, // Callback for when a facing is deleted
      ...options
    };
    
    // Calculate planogram dimensions
    const maxShelfY = Math.max(...Object.values(skuList).flatMap(sku => 
      sku.shelf_index_yArray || [sku.shelf_index_y || 0]
    ));
    const maxShelfX = Math.max(...Object.values(skuList).flatMap(sku => 
      sku.shelf_index_xArray || [sku.shelf_index_x || 0]
    ));
    
    const planogramHeight = (maxShelfY + 1) * config.fixtureHeight;
    
    // Create main planogram container
    const $planogram = $('<div>', {
      class: 'planogram-container',
      css: {
        position: 'relative',
        width: config.containerWidth + 'px',
        height: planogramHeight + 'px',
        border: '2px solid #333',
        backgroundColor: '#f5f5f5',
        margin: '20px 0'
      }
    });
    
    // Add shelf lines
    for (let y = 0; y <= maxShelfY; y++) {
      const $shelfLine = $('<div>', {
        class: 'shelf-line',
        css: {
          position: 'absolute',
          top: (y * config.fixtureHeight) + 'px',
          left: '0',
          right: '0',
          height: '1px',
          backgroundColor: '#666',
          zIndex: 1
        }
      });
      $planogram.append($shelfLine);
      
      // Add shelf label
      const $shelfLabel = $('<div>', {
        class: 'shelf-label',
        text: `Shelf ${maxShelfY - y}`,
        css: {
          position: 'absolute',
          top: (y * config.fixtureHeight + 2) + 'px',
          left: '5px',
          fontSize: '10px',
          color: '#666',
          zIndex: 2
        }
      });
      $planogram.append($shelfLabel);
    }
    
    // Process each SKU and create facings
    Object.entries(skuList).forEach(([upc, sku]) => {
      if (sku.type === 'SKU' && sku.shelf_index_xArray && sku.shelf_index_yArray) {
        // Create facings for each position
        sku.shelf_index_xArray.forEach((shelfX, index) => {
          const shelfY = sku.shelf_index_yArray[index];
          const stackIndex = sku.stack_indexArray ? sku.stack_indexArray[index] : 0;
          
          createFacing(sku, shelfX, shelfY, stackIndex, index, $planogram, config);
        });
      }
    });
    
    return $planogram;
  }
  
  function createFacing(sku, shelfX, shelfY, stackIndex, facingIndex, $container, config) {
    // Calculate position and dimensions
    const facingWidth = (sku.width || 20) * config.scale;
    const facingHeight = (sku.height || 20) * config.scale;
    
    // Position calculation
    const leftPosition = (shelfX * 80) + (stackIndex * 5); // Base spacing with stack offset
    const topPosition = (shelfY * config.fixtureHeight) + 
                       (config.fixtureHeight - facingHeight - 2); // Align to bottom of shelf
    
    // Determine color based on classification
    const backgroundColor = getProductColor(sku.classification);
    
    // Create facing element
    const $facing = $('<div>', {
      class: 'planogram-facing',
      'data-upc': sku.upc,
      'data-facing-index': facingIndex,
      css: {
        position: 'absolute',
        left: leftPosition + 'px',
        top: topPosition + 'px',
        width: facingWidth + 'px',
        height: facingHeight + 'px',
        backgroundColor: backgroundColor,
        border: '1px solid #333',
        borderRadius: '2px',
        cursor: 'pointer',
        zIndex: 10 + stackIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px',
        color: '#fff',
        textAlign: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }
    });
    
    // Add product name (truncated)
    const displayName = sku.name.length > 15 ? sku.name.substring(0, 12) + '...' : sku.name;
    $facing.text(displayName);
    
    // Add price if available
    if (sku.prices && sku.prices.length > 0) {
      const $price = $('<div>', {
        css: {
          position: 'absolute',
          bottom: '1px',
          right: '2px',
          fontSize: '6px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '1px 2px',
          borderRadius: '2px'
        },
        text: `£${sku.prices[0]}`
      });
      $facing.append($price);
    }
    
    // Add hover effects
    $facing.hover(
      function() {
        $(this).css({
          'box-shadow': '0 0 5px rgba(0,0,0,0.5)',
          'transform': 'scale(1.05)'
        });
        showTooltip($(this), sku);
      },
      function() {
        $(this).css({
          'box-shadow': 'none',
          'transform': 'scale(1)'
        });
        hideTooltip();
      }
    );
    
    // Add delete functionality
    $facing.on('contextmenu', function(e) {
      e.preventDefault();
      showDeleteMenu($(this), sku, facingIndex, config);
    });
    
    $container.append($facing);
  }
  
  function getProductColor(classification) {
    const colorMap = {
      'Soft Drinks': '#e74c3c',
      'Coffee': '#8b4513',
      'Energy': '#f39c12',
      'Empty Facing': '#bdc3c7',
      'Unrecognized': '#95a5a6'
    };
    return colorMap[classification] || '#34495e';
  }
  
  function showTooltip($element, sku) {
    const $tooltip = $('<div>', {
      class: 'planogram-tooltip',
      css: {
        position: 'absolute',
        backgroundColor: '#333',
        color: '#fff',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '11px',
        zIndex: 1000,
        maxWidth: '200px',
        pointerEvents: 'none'
      }
    });
    
    const tooltipContent = `
      <strong>${sku.name}</strong><br>
      Brand: ${sku.brand}<br>
      Size: ${sku.size}<br>
      UPC: ${sku.upc}<br>
      ${sku.prices && sku.prices.length > 0 ? `Price: £${sku.prices[0]}` : 'No price'}
    `;
    
    $tooltip.html(tooltipContent);
    $('body').append($tooltip);
    
    // Position tooltip
    const offset = $element.offset();
    $tooltip.css({
      top: (offset.top - $tooltip.outerHeight() - 5) + 'px',
      left: (offset.left + $element.outerWidth() / 2 - $tooltip.outerWidth() / 2) + 'px'
    });
  }
  
  function hideTooltip() {
    $('.planogram-tooltip').remove();
  }
  
  function showDeleteMenu($element, sku, facingIndex, config) {
    // Remove any existing delete menu
    $('.planogram-delete-menu').remove();
    
    const $deleteMenu = $('<div>', {
      class: 'planogram-delete-menu',
      css: {
        position: 'absolute',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 2000,
        minWidth: '120px'
      }
    });
    
    const $deleteOption = $('<div>', {
      text: 'Delete Facing',
      css: {
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '12px',
        color: '#e74c3c'
      }
    });
    
    $deleteOption.hover(
      function() { $(this).css('backgroundColor', '#f8f9fa'); },
      function() { $(this).css('backgroundColor', 'transparent'); }
    );
    
    $deleteOption.click(function() {
      deleteFacing($element, sku, facingIndex, config);
      $('.planogram-delete-menu').remove();
    });
    
    $deleteMenu.append($deleteOption);
    $('body').append($deleteMenu);
    
    // Position menu
    const offset = $element.offset();
    $deleteMenu.css({
      top: offset.top + 'px',
      left: (offset.left + $element.outerWidth()) + 'px'
    });
    
    // Close menu when clicking outside
    $(document).one('click', function() {
      $('.planogram-delete-menu').remove();
    });
  }
  
  function deleteFacing($element, sku, facingIndex, config) {
    // Animate removal
    $element.fadeOut(300, function() {
      $(this).remove();
    });
    
    // Call callback if provided
    if (config.onFacingDelete && typeof config.onFacingDelete === 'function') {
      config.onFacingDelete(sku, facingIndex);
    }
  }
  
  return {
    createPlanogram: function (skuList, options) {  
      return createPlanogram(skuList, options);
    }
  };
  
})(jQuery, ksAPI);