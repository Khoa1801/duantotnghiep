import './cart.css'
function GioHang(){
    return(

      <body>
      <div class="container">
          <nav>
              <a href="#">Trang chủ</a> / <a href="#">Giỏ hàng (1)</a>
          </nav>
          <h1>GIỎ HÀNG CỦA BẠN</h1>
          <div class="cart-container">
              <div class="cart-items">
                  <div class="cart-item">
                      <img src="product.jpg" alt="Áo Thun"/>
                      <div class="cart-details">
                          <p class="product-name">Áo Thun Jersey Polo New Era NY Black White</p>
                          <p class="product-code">17242980 - Size: S</p>
                          <div class="quantity">
                              <button>-</button>
                              <span>1</span>
                              <button>+</button>
                          </div>
                          <p class="price">550,000₫ <span class="old-price">1,100,000₫</span></p>
                      </div>
                      <div class="total-price">550,000₫</div>
                      <button class="remove">xoa</button>
                  </div>
                  <textarea placeholder="Ghi chú đơn hàng"></textarea>
              </div>
              <div class="order-summary">
                  <h3>Thông tin đơn hàng</h3>
                  <p>Tổng tiền: <strong>550,000₫</strong></p>
                  <button class="checkout">THANH TOÁN</button>
                  <button class="support"> CLICK VÀO ĐÂY ĐỂ SHOP TƯ VẤN </button>
              </div>
          </div>
      </div>
  </body>
  );
}
export default GioHang;