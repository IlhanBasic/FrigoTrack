import "./product.css";
import CreateProductForm from '../../components/CreateProductForm.jsx';
export default function CreateProduct() {
  return (
    <div className="create-product">
      <h1>Dodaj Proizvod</h1>
      <CreateProductForm />
    </div>
  );
}
