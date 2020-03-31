import React from 'react';
import logo from './Assets/LOGO.png'
import cover from './Assets/cover.jpg'
import './CSS/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

function Header() {
  return (
    <header class="row-sm-12">
      <img src={cover} class="cover" alt="لقمه"/>
      <div class="title-description">
        <figure class="figure">
          <img src={logo} class="figure-img" alt="لقمه"/>
          <figcaption class="figure-caption">اولین و بزرگترین وب‌سایت سفارش آنلاین غذا در دانشگاه تهران</figcaption>
        </figure>
      </div>
    </header>
  );
  }

function Footer() {
  return (
    <footer>&copy; تمامی حقوق متعلق به لقمه است.</footer>
  );
}

class Form extends React.Component {
  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }
}

function toPersianNum(inp) {
  var i = 0,
  num = inp.toString(),
  len = num.length,
  res = '',
  pos,
  persianNumbers =
      ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  for (; i < len; i++)
      if (( pos = persianNumbers[num.charAt(i)] ))
          res += pos;
      else
          res += num.charAt(i);
  return res;
}

export {
    Header,
    Footer,
    Form,
    toPersianNum
}