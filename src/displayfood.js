import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import $, { extend } from 'jquery';
function Displayfood() {
  const [hits, setHits] = useState([]);
  function orderfood(){
    alert("order food");
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
         if(headers.status == 400) {
             console.log('fail to add');
             return;
         }
         if(headers.status == 201) {
           alert("add successful");
             console.log('addfood succussful');
             localStorage.setItem('action','add food');  
           this.display();
             return;
         }
     })
     .catch((error)=> {console.log(error)});}
     else{
         alert("please select value");
     }
   
   });
  };
  useEffect(() => {
  fetch('https://ux2backend.herokuapp.com/api/api.php?action=displayorderfood',
  {
          method: 'POST',
          credentials: 'include'
      }
      )   .then(response => response.json())
      .then(data => {
        setHits(data);
      });
    }, []);
  return (
    <form>
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
    <td>{hit.options}</td>
    <td><input type="submit" name="submit" class="btnSelect" onClick={()=>this.orderfood()}></input></td>
     </tr>
          ) )}
    </tbody>
</table>
</form>
  );
}
export default Displayfood;