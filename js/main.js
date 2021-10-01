class GoodsItem {
    constructor(title, price, id, count) {
        this.title = title;
        this.price = price;
        this.id = id;
        this.count = count;
    }

    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p><p><button data-id='${this.id}' class='buy'>Купить</button></p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }

    fetchGoods(cb) {
        makeGETRequest(`js/prods.json`)
            .then(
                response => {
                    this.goods = JSON.parse(response);
                    cb();
                },
                error => alert(`Rejected: ${error}`)
            );
    }

    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price, good.id);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
}

function makeGETRequest(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            if (this.status == 200) {
                resolve(this.response);
            } else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function () {
            reject(new Error("Network Error"));
        };
        xhr.send();
    });

}

const list = new GoodsList();
list.fetchGoods(() => {
    list.render();
    basket.addProduct();
});

class Basket {
    constructor() {
        this.basket = [];
    }

    addProduct() {
        let btn = document.querySelectorAll('.buy');
        console.log(btn);
        btn.forEach(el => {
            el.addEventListener('click', () => {

                let checkProduct = this.basket.find(item => item.id == el.dataset.id);

                if (checkProduct === undefined) {
                    let product = list.goods.find(item => item.id == el.dataset.id);
                    this.basket.push(product);
                    basketItem.renderBasket();
                } else {
                    checkProduct.count = checkProduct.count + 1;
                    basketItem.renderBasket();
                }
            })
        })
    }

    removeProduct() {
        let btnClr = document.querySelectorAll('.clearBasket');
        btnClr.forEach(el => {
            el.addEventListener('click', () => {
                let checkProduct = this.basket.find(item => item.id == el.dataset.id);
                if (checkProduct.count === 1) {
                    let product = this.basket.findIndex(item => item.id == el.dataset.id);
                    this.basket.splice(product, 1);
                    basketItem.renderBasket();
                } else {
                    checkProduct.count = checkProduct.count - 1;
                    basketItem.renderBasket();
                }
            })
        })
    }
}

let basket = new Basket();
basket.addProduct();
basket.removeProduct();

class BasketItem {
    constructor(title, price, id, count) {
        this.title = title;
        this.price = price;
        this.id = id;
        this.count = count;
    }

    renderBasket() {
        let $basket = document.getElementById('basket');
        let $put = '';
        if (basket.basket.length > 0) {
            for (let k = 0; k < basket.basket.length; k++) {
                $put += `
            <p>Name: ${basket.basket[k].title}</p>
            <p>Price: ${basket.basket[k].price}</p>
            <p class="basketCount">Count: ${basket.basket[k].count}</p>
            <p>Sum: ${basket.basket[k].count * basket.basket[k].price}</p>
            <p><button data-id='${basket.basket[k].id}' class="clearBasket">Удалить продукт</button></p>
            `
            }
        } else {
            $put = `
            <div>Корзина Пуста</div>
            `
        }
        document.getElementById('basket').innerHTML = $put;
        basket.removeProduct();
    }
}

let basketItem = new BasketItem();
basketItem.renderBasket();
