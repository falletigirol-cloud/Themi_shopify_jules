class Cart {
  constructor() {
    this.container = document.querySelector('[data-cart-container]');
    if (!this.container) return;

    this.getCart();
    this.initEventListeners();
  }

  initEventListeners() {
    document.body.addEventListener('click', (event) => {
      const target = event.target;
      if (target.matches('[data-add-to-cart]')) {
        event.preventDefault();
        const form = event.target.closest('form');
        this.addItemFromForm(form);
      }
      if (target.matches('.quantity-button')) {
        this.handleQuantityButtonClick(target);
      }
      if (target.closest('[data-remove-item]')) {
        event.preventDefault();
        this.handleRemoveItemClick(target);
      }
    });

    document.body.addEventListener('change', (event) => {
      if (event.target.matches('.quantity-input')) {
        this.handleQuantityInputChange(event.target);
      }
    });
  }

  handleQuantityButtonClick(button) {
    const lineKey = button.dataset.lineKey;
    const action = button.dataset.action;
    const input = document.querySelector(`.quantity-input[data-line-key="${lineKey}"]`);
    let value = parseInt(input.value);

    if (action === 'increment') {
      value++;
    } else {
      value = value > 1 ? value - 1 : 0;
    }

    input.value = value;
    this.updateCart(lineKey, value);
  }

  handleRemoveItemClick(target) {
    const lineKey = target.closest('[data-line-item]').dataset.lineItem;
    this.updateCart(lineKey, 0);
  }

  handleQuantityInputChange(input) {
    const lineKey = input.dataset.lineKey;
    const quantity = input.value;
    this.updateCart(lineKey, quantity);
  }

  addItemFromForm(form) {
    const formData = new FormData(form);
    fetch('/cart/add.js', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        this.getCart();
        // You can add a notification here
    })
  }

  updateCart(lineKey, quantity) {
    this.toggleLoading(true);
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: lineKey,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(data => {
      this.updateCartUI(data);
    });
  }

  getCart() {
      fetch('/cart.js')
      .then(response => response.json())
      .then(data => {
          this.updateCartUI(data)
      })
  }

  updateCartUI(cart) {
    this.updateCartCount(cart.item_count);

    const cartItemsContainer = document.querySelector('[data-cart-items-container]');
    if(cartItemsContainer) {
        this.updateCartPage(cart, cartItemsContainer);
    }
    this.toggleLoading(false);
  }

  updateCartPage(cart, container) {
    const itemCountEl = document.querySelector('[data-cart-item-count]');
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    const totalEl = document.querySelector('[data-cart-total]');

    if(itemCountEl) itemCountEl.textContent = `${cart.item_count} articoli`;
    if(subtotalEl) subtotalEl.textContent = Shopify.formatMoney(cart.total_price);
    if(totalEl) totalEl.textContent = Shopify.formatMoney(cart.total_price);

    let itemsHtml = '';
    cart.items.forEach(item => {
        itemsHtml += this.getLineItemHtml(item);
    })
    container.innerHTML = itemsHtml;
  }

  getLineItemHtml(item) {
      return `
        <li class="flex items-center gap-6 py-6" data-line-item="${item.key}">
            <div class="h-24 w-24 flex-shrink-0">
            <img alt="${item.title}" class="h-full w-full rounded-md object-cover" src="${item.image}">
            </div>
            <div class="flex-1">
            <h4 class="text-base font-semibold text-burnt-sienna">${item.product_title}</h4>
            <p class="text-sm text-sage-green">${item.variant_title}</p>
            <p class="mt-2 text-lg font-bold text-sage-green" data-line-item-price>${Shopify.formatMoney(item.final_line_price)}</p>
            </div>
            <div class="flex items-center gap-2">
            <button type="button" class="quantity-button flex h-8 w-8 items-center justify-center rounded-full border border-light-gray text-burnt-sienna hover:bg-beige" data-line-key="${item.key}" data-action="decrement">-</button>
            <input class="quantity-input w-10 rounded-md border-light-gray text-center text-sm font-medium focus:border-sage-green focus:ring-sage-green" type="number" value="${item.quantity}" min="0" data-line-key="${item.key}">
            <button type="button" class="quantity-button flex h-8 w-8 items-center justify-center rounded-full border border-light-gray text-burnt-sienna hover:bg-beige" data-line-key="${item.key}" data-action="increment">+</button>
            </div>
            <a href="/cart/change?id=${item.key}&amp;quantity=0" class="text-sage-green hover:text-red-600" data-remove-item>
            <span class="material-symbols-outlined">delete</span>
            </a>
        </li>
      `
  }

  updateCartCount(count) {
    const cartCountEls = document.querySelectorAll('[data-cart-count]');
    cartCountEls.forEach(el => {
      el.textContent = count;
    });
  }

  toggleLoading(isLoading) {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.toggle('hidden', !isLoading);
    }
  }
}

new Cart();

// Product page tabs
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('border-sage-green', 'text-sage-green');
        t.classList.add('border-transparent', 'text-gray-500');
      });

      this.classList.add('border-sage-green', 'text-sage-green');
      this.classList.remove('border-transparent', 'text-gray-500');

      tabContents.forEach(content => {
        if (content.dataset.tabContent === tabName) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });
});
