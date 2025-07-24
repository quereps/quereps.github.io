var irToplanogramModule = (function ($, ksAPI) {
  
  // Planogram Class
  function Planogram(skuList, options = {}) {
    this.config = {
      fixtureHeight: options.fixtureHeight || 80, // Height per fixture in pixels
      fixtureSpacing: options.fixtureSpacing || 10, // Space between fixtures
      scale: options.scale || 2, // Scale factor for product dimensions
      containerWidth: options.containerWidth || 800,
      onFacingDelete: options.onFacingDelete || null,
      ...options
    };
    
    this.skuList = skuList;
    this.segments = [];
    this.$container = null;
    
    this.init();
  }
  
  Planogram.prototype.init = function() {
    this.calculateDimensions();
    this.createContainer();
    this.createSegments();
  };
  
  Planogram.prototype.calculateDimensions = function() {
    this.maxShelfY = Math.max(...Object.values(this.skuList).flatMap(sku => 
      sku.shelf_index_yArray || [sku.shelf_index_y || 0]
    ));
    this.maxShelfX = Math.max(...Object.values(this.skuList).flatMap(sku => 
      sku.shelf_index_xArray || [sku.shelf_index_x || 0]
    ));
    
    this.totalHeight = (this.maxShelfY + 1) * (this.config.fixtureHeight + this.config.fixtureSpacing);
  };
  
  Planogram.prototype.createContainer = function() {
    this.$container = $('<div>', {
      class: 'planogram-container',
      css: {
        position: 'relative',
        width: this.config.containerWidth + 'px',
        height: this.totalHeight + 'px',
        border: '2px solid #333',
        backgroundColor: '#f0f0f0',
        margin: '20px 0',
        fontFamily: 'Arial, sans-serif'
      }
    });
  };
  
  Planogram.prototype.createSegments = function() {
    // For now, create one segment that covers the entire planogram
    const segment = new Segment(this, 0, 0, this.config.containerWidth, this.totalHeight);
    this.segments.push(segment);
    this.$container.append(segment.$element);
  };
  
  Planogram.prototype.getContainer = function() {
    return this.$container;
  };
  
  // Segment Class
  function Segment(planogram, x, y, width, height) {
    this.planogram = planogram;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fixtures = [];
    this.$element = null;
    
    this.init();
  }
  
  Segment.prototype.init = function() {
    this.createContainer();
    this.createFixtures();
  };
  
  Segment.prototype.createContainer = function() {
    this.$element = $('<div>', {
      class: 'planogram-segment',
      css: {
        position: 'absolute',
        left: this.x + 'px',
        top: this.y + 'px',
        width: this.width + 'px',
        height: this.height + 'px',
        border: '1px dashed #999'
      }
    });
  };
  
  Segment.prototype.createFixtures = function() {
    // Create fixtures for each shelf level
    for (let shelfY = 0; shelfY <= this.planogram.maxShelfY; shelfY++) {
      const fixtureY = shelfY * (this.planogram.config.fixtureHeight + this.planogram.config.fixtureSpacing);
      const fixture = new Fixture(this, shelfY, 0, fixtureY, this.width, this.planogram.config.fixtureHeight);
      this.fixtures.push(fixture);
      this.$element.append(fixture.$element);
    }
  };
  
  // Fixture Class
  function Fixture(segment, shelfLevel, x, y, width, height) {
    this.segment = segment;
    this.shelfLevel = shelfLevel;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.facings = [];
    this.$element = null;
    this.$facingsContainer = null;
    
    this.init();
  }
  
  Fixture.prototype.init = function() {
    this.createContainer();
    this.createFacingsContainer();
    this.populateFacings();
  };
  
  Fixture.prototype.createContainer = function() {
    this.$element = $('<div>', {
      class: 'planogram-fixture',
      'data-shelf-level': this.shelfLevel,
      css: {
        position: 'absolute',
        left: this.x + 'px',
        top: this.y + 'px',
        width: this.width + 'px',
        height: this.height + 'px',
        backgroundColor: '#e8e8e8',
        border: '1px solid #666',
        borderRadius: '3px',
        overflow: 'hidden'
      }
    });
    
    // Add fixture label
    const $label = $('<div>', {
      class: 'fixture-label',
      text: `Shelf ${this.segment.planogram.maxShelfY - this.shelfLevel + 1}`,
      css: {
        position: 'absolute',
        top: '2px',
        left: '5px',
        fontSize: '10px',
        color: '#666',
        fontWeight: 'bold',
        zIndex: 1
      }
    });
    this.$element.append($label);
  };
  
  Fixture.prototype.createFacingsContainer = function() {
    this.$facingsContainer = $('<div>', {
      class: 'facings-container',
      css: {
        position: 'absolute',
        top: '15px', // Leave space for label
        left: '5px',
        right: '5px',
        bottom: '5px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end', // Align facings to bottom of fixture
        gap: '2px',
        overflow: 'hidden'
      }
    });
    this.$element.append(this.$facingsContainer);
  };
  
  Fixture.prototype.populateFacings = function() {
    // Get all SKUs for this shelf level, sorted by X position
    const shelfSKUs = [];
    
    Object.entries(this.segment.planogram.skuList).forEach(([upc, sku]) => {
      if (sku.type === 'SKU' && sku.shelf_index_yArray && sku.shelf_index_xArray) {
        sku.shelf_index_yArray.forEach((shelfY, index) => {
          if (shelfY === this.shelfLevel) {
            const shelfX = sku.shelf_index_xArray[index];
            const stackIndex = sku.stack_indexArray ? sku.stack_indexArray[index] : 0;
            
            shelfSKUs.push({
              sku: sku,
              shelfX: shelfX,
              stackIndex: stackIndex,
              facingIndex: index
            });
          }
        });
      }
    });
    
    // Sort by X position then by stack index
    shelfSKUs.sort((a, b) => {
      if (a.shelfX !== b.shelfX) return a.shelfX - b.shelfX;
      return a.stackIndex - b.stackIndex;
    });
    
    // Create facings
    shelfSKUs.forEach(item => {
      const facing = new Facing(this, item.sku, item.facingIndex);
      this.facings.push(facing);
      this.$facingsContainer.append(facing.$element);
    });
  };
  
  // Facing Class
  function Facing(fixture, sku, facingIndex) {
    this.fixture = fixture;
    this.sku = sku;
    this.facingIndex = facingIndex;
    this.$element = null;
    
    this.init();
  }
  
  Facing.prototype.init = function() {
    this.createContainer();
    this.addInteractions();
  };
  
  Facing.prototype.createContainer = function() {
    const config = this.fixture.segment.planogram.config;
    
    // Calculate dimensions
    const facingWidth = Math.max((this.sku.width || 20) * config.scale, 30); // Minimum width
    const facingHeight = Math.min((this.sku.height || 20) * config.scale, this.fixture.height - 25); // Max height minus label space
    
    // Determine color based on classification
    const backgroundColor = this.getProductColor(this.sku.classification);
    
    this.$element = $('<div>', {
      class: 'planogram-facing',
      'data-upc': this.sku.upc,
      'data-facing-index': this.facingIndex,
      css: {
        width: facingWidth + 'px',
        height: facingHeight + 'px',
        backgroundColor: backgroundColor,
        border: '1px solid #333',
        borderRadius: '3px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px',
        color: '#fff',
        textAlign: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '2px',
        flexShrink: 0, // Prevent shrinking in flex container
        position: 'relative'
      }
    });
    
    // Add product name (truncated)
    const displayName = this.sku.name.length > 12 ? this.sku.name.substring(0, 10) + '...' : this.sku.name;
    const $nameDiv = $('<div>', {
      css: {
        fontSize: '7px',
        lineHeight: '1.2',
        marginBottom: '2px',
        textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
      },
      text: displayName
    });
    this.$element.append($nameDiv);
    
    // Add size
    if (this.sku.size && this.sku.size !== 'Unrecognized') {
      const $sizeDiv = $('<div>', {
        css: {
          fontSize: '6px',
          opacity: 0.8
        },
        text: this.sku.size
      });
      this.$element.append($sizeDiv);
    }
    
    // Add price if available
    if (this.sku.prices && this.sku.prices.length > 0) {
      const $price = $('<div>', {
        css: {
          position: 'absolute',
          bottom: '2px',
          right: '2px',
          fontSize: '6px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '1px 3px',
          borderRadius: '2px',
          color: '#fff'
        },
        text: `£${this.sku.prices[0]}`
      });
      this.$element.append($price);
    }
  };
  
  Facing.prototype.getProductColor = function(classification) {
    const colorMap = {
      'Soft Drinks': '#e74c3c',
      'Coffee': '#8b4513',
      'Energy': '#f39c12',
      'Empty Facing': '#bdc3c7',
      'Unrecognized': '#95a5a6'
    };
    return colorMap[classification] || '#34495e';
  };
  
  Facing.prototype.addInteractions = function() {
    const self = this;
    
    // Hover effects
    this.$element.hover(
      function() {
        $(this).css({
          'box-shadow': '0 0 8px rgba(0,0,0,0.6)',
          'transform': 'scale(1.05)',
          'z-index': '100'
        });
        self.showTooltip();
      },
      function() {
        $(this).css({
          'box-shadow': 'none',
          'transform': 'scale(1)',
          'z-index': 'auto'
        });
        self.hideTooltip();
      }
    );
    
    // Right-click for delete menu
    this.$element.on('contextmenu', function(e) {
      e.preventDefault();
      self.showDeleteMenu();
    });
  };
  
  Facing.prototype.showTooltip = function() {
    const $tooltip = $('<div>', {
      class: 'planogram-tooltip',
      css: {
        position: 'absolute',
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '11px',
        zIndex: 1000,
        maxWidth: '250px',
        pointerEvents: 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }
    });
    
    const tooltipContent = `
      <div style="margin-bottom: 5px;"><strong>${this.sku.name}</strong></div>
      <div>Brand: ${this.sku.brand}</div>
      <div>Size: ${this.sku.size}</div>
      <div>Classification: ${this.sku.classification}</div>
      <div>UPC: ${this.sku.upc}</div>
      ${this.sku.prices && this.sku.prices.length > 0 ? `<div>Price: £${this.sku.prices[0]}</div>` : '<div>No price available</div>'}
    `;
    
    $tooltip.html(tooltipContent);
    $('body').append($tooltip);
    
    // Position tooltip
    const offset = this.$element.offset();
    $tooltip.css({
      top: (offset.top - $tooltip.outerHeight() - 10) + 'px',
      left: Math.max(0, offset.left + this.$element.outerWidth() / 2 - $tooltip.outerWidth() / 2) + 'px'
    });
  };
  
  Facing.prototype.hideTooltip = function() {
    $('.planogram-tooltip').remove();
  };
  
  Facing.prototype.showDeleteMenu = function() {
    const self = this;
    
    // Remove any existing delete menu
    $('.planogram-delete-menu').remove();
    
    const $deleteMenu = $('<div>', {
      class: 'planogram-delete-menu',
      css: {
        position: 'absolute',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 2000,
        minWidth: '140px'
      }
    });
    
    const $deleteOption = $('<div>', {
      text: '🗑️ Delete Facing',
      css: {
        padding: '10px 15px',
        cursor: 'pointer',
        fontSize: '12px',
        color: '#e74c3c',
        borderRadius: '4px'
      }
    });
    
    $deleteOption.hover(
      function() { $(this).css('backgroundColor', '#f8f9fa'); },
      function() { $(this).css('backgroundColor', 'transparent'); }
    );
    
    $deleteOption.click(function() {
      self.delete();
      $('.planogram-delete-menu').remove();
    });
    
    $deleteMenu.append($deleteOption);
    $('body').append($deleteMenu);
    
    // Position menu
    const offset = this.$element.offset();
    $deleteMenu.css({
      top: (offset.top + this.$element.outerHeight()) + 'px',
      left: offset.left + 'px'
    });
    
    // Close menu when clicking outside
    $(document).one('click', function() {
      $('.planogram-delete-menu').remove();
    });
  };
  
  Facing.prototype.delete = function() {
    const config = this.fixture.segment.planogram.config;
    const self = this;
    
    // Animate removal
    this.$element.fadeOut(300, function() {
      $(this).remove();
      
      // Call callback if provided
      if (config.onFacingDelete && typeof config.onFacingDelete === 'function') {
        config.onFacingDelete(self.sku, self.facingIndex);
      }
    });
  };
  
  function createPlanogram(skuList, options) {
    const planogram = new Planogram(skuList, options);
    return planogram.getContainer();
  }
  
  return {
    createPlanogram: function (skuList, options) {  
      return createPlanogram(skuList, options);
    },
    // Expose classes for advanced usage
    Planogram: Planogram,
    Segment: Segment,
    Fixture: Fixture,
    Facing: Facing
  };
  
})(jQuery, ksAPI);