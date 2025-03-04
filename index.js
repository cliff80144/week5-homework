
//彈出視窗
import userProductModal from './userProductModal.js';

// const url = 'https://vue3-course-api.hexschool.io/v2';
// const path = 'cliffwu-vueapi';

// 定義驗證規則
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
// 改成繁體中文
configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'cliffwu-vueapi';

Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    };
  },
  //----------------------------------------子元件(表單驗證)
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  //----------------------------------------方法
  methods: {
    //取產品列表
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios.get(url)
      .then((response) => {
        this.products = response.data.products;//先存起來
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;// data參數
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((response) => {
        this.loadingStatus.loadingItem = '';
        this.product = response.data.product;
        this.$refs.userProductModal.openModal();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    addToCart(id, qty = 1) {//預設數量為1
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.loadingStatus.loadingItem = id;// 加入購物車的時候帶入 product_id
      const cart = {   // 從 api文件 中把 api 會回傳的資料貼上!!!!!!!!!!!!!!!!!!!!!!!
        product_id: id,
        qty,
      };

      this.$refs.userProductModal.hideModal();
      axios.post(url, { data: cart }).then((response) => {
        alert(response.data.message);
        this.loadingStatus.loadingItem = '';
        this.getCart();// 每加入購物車，重新取出購物車列表
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    updateCart(data) {
      this.loadingStatus.loadingItem = data.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;// data參數
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      axios.put(url, { data: cart }).then((response) => {
        alert(response.data.message);
        this.loadingStatus.loadingItem = '';
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
        this.loadingStatus.loadingItem = '';
      });
    },
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((response) => {
        alert(response.data.message);
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url).then((response) => {
        this.cart = response.data.data;
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url).then((response) => {
        alert(response.data.message);
        this.loadingStatus.loadingItem = '';
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        alert(response.data.message);
        this.$refs.form.resetForm();// 清除表單欄位
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
  },
  //----------------------------------------初始化
  mounted() {
    this.getProducts();//產品列表
    this.getCart();//購物車
  },
})
  .component('userProductModal', userProductModal)//連動modal
  .mount('#app');



  // const url = 'https://vue3-course-api.hexschool.io/v2';
// const path = 'cliffwu-vueapi';