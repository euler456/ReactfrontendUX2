import React  from 'react';

function Displayfood() {
  // 宣告一個新的 state 變數，我們叫他「count」
  const hits = response.data.hits;
  fetch('https://ux2backend.herokuapp.com/api/api.php?action=displayorderfood',
  {
          method: 'POST',
          credentials: 'include'
      }
      )   .then(response => response.json())
      .then(data => this.setState({ hits: data }));

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