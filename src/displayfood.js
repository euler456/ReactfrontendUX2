import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import $, { extend } from 'jquery';
import {
  Redirect 
} from "react-router-dom";
function Displayfood() {
  const [hits, setHits] = useState([]);
  const [order, setorder] = useState([]);
  const [redirect, setredirect] = useState(false);
  const [loading, setloading] = useState(false);
  function display(){
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=showorderform',
        {
                method: 'GET',
                credentials: 'include'
            }
            ) .then(response => response.json())
            .then(data => {
              setorder(data);
            });
   }
   function fetchorderdelete(dd){
   
    console.log(dd);
    const fd = new FormData();
    fd.append('orderitem_ID', dd);
    console.log(fd);
   fetch('https://ux2backend.herokuapp.com/api/api.php?action=orderdelete', 
   {
       method: 'POST',
       body: fd,
       credentials: 'include'
   })
   .then(function(headers) {
       if(headers.status == 400) {
           console.log('can not delete');
           return;
       }
    
       if(headers.status == 201) {
            display();
           alert('delete succussful');
           localStorage.setItem('reload','has been reload');   
           localStorage.setItem('action','orderdelete');   
           return;
       }
   })
   .catch(function(error) {console.log(error)});
     }
   function completeorder(){
   setloading({ loading: true});
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=sumtotalprice', 
    {
        method: 'GET',
        credentials: 'include'
    })
   .then((headers) =>{
        if(headers.status == 403) {
            console.log('fail to sum ');
            return;
        }
        if(headers.status == 201) {
            console.log('sumtotalprice');
        setredirect({ redirect: true });
            localStorage.setItem('reload','has been reload');   
            localStorage.setItem('action','checking out');   
            return;
        }
    })
    .catch(function(error) {console.log(error)});
     }
  
 
  useEffect(() => {
    $("#orderform").on('click', '.btnSelect', function() {
      var currentRow = $(this).closest("tr");
      var col1 = currentRow.find(".fd-value").val(); 
      var col2 = currentRow.find(".fd-id").html(); 
      var col3 = currentRow.find(".fd-name").html(); 
      var col4 = currentRow.find(".price").html();
      var col5 =col4 * col1;
      if(col1 !=0){
      var fd = new FormData();
      fd.append('F_ID',col2 );
      fd.append('foodname', col3 );
      fd.append('price', col4 );
      fd.append('quantity', col1 );
      fd.append('totalprice', col5 );
      fetch('https://ux2backend.herokuapp.com/api/api.php?action=orderquantity', 
      {
          method: 'POST',
          body: fd,
          credentials: 'include'
      })
     .then((headers)=> {
          if(headers.status == 403) {
              console.log('fail to add,plz login');
              alert('fail to add,plz login');
              return;
          }
          if(headers.status == 201) {
            alert("add successful");
              console.log('addfood succussful');
              localStorage.setItem('action','add food');  
             display();
        
          }
      })
      .catch((error)=> {console.log(error)});}
      else{
          alert("please select value");
      }
    
    });
  
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=isloggedin',
    {
            method: 'POST',
            credentials: 'include'
        }
        )   .then((headers)=> {
          if(headers.status == 403) {
              console.log('fail to display,plz login');
              return;
          }
          if(headers.status == 203) {
            fetch('https://ux2backend.herokuapp.com/api/api.php?action=displayorderfood',
            {
                    method: 'POST',
                    credentials: 'include'
                }
                )   .then(response => response.json())
                .then(data => { setHits(data); } )
                .then (() => display())
                ;
              }
            })
      .catch((error)=> {console.log(error)});}
      , []);

 
    if (redirect) {return <Redirect to='/payment' /> };
    if (loading) {return <Loader />};
  return (
    <body>
    <form class="orderblock">
    <table>
    <thead>
        <th>Name</th>
        <th>image</th>
        <th>Price</th>
        <th>Quantity</th>
    </thead>
    <tbody id="orderform">
          {hits.map(hit =>( 
         <tr>
    <td hidden class='fd-id'>{hit.F_ID}</td>
    <td class='fd-name'>{hit.foodname}</td>
    <td ><img src={require(`./images/${hit.image}.jpg`).default}></img></td>
    <td class='price'>{hit.price}</td>
    <td><input type="number" class="fd-value" name="quantity" min="0" max="50"></input></td>
    <td><input type="submit" name="submit" class="btnSelect" ></input></td>
     </tr>
          ) )}
    </tbody>
</table>
</form>
  <form  class="orderblock">
  <h1>Your order</h1>
<table>
   <thead>
       <th>Name</th>
       <th>Price</th>
       <th>Value</th>
       <th>totalprice</th>
   </thead>
   <tbody class="showtbody" id="showorderform">
   {order.map(response =>(
          <tr>
          <td >{response.foodname}</td>
          <td >{response.price}</td>
          <td>{response.quantity}</td>
          <td >{response.totalprice}</td>
          <td><input type="submit" name="delete" value="delete"  onClick={() =>fetchorderdelete(`${response.orderitem_ID}`)}></input></td>
          </tr>    ) )}
   </tbody>
</table>
<input type="submit"  name="submit" value="Complete order" onClick={() => completeorder()}></input>
</form>
</body>
  );
}
export default Displayfood;