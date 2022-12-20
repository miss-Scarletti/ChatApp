import "./ListItem.css";

export default function ListItem({ item, index, deleteItem }) {
  return (
    <li className="item">
      {item}
      <span className="delete" onClick={() => deleteItem(index)}>
        x
      </span>
    </li>
  );
}
