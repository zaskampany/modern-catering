"use client";
import { useState } from "react";
import Reveal from "@/components/Reveal";

// Full menu. An item is a dish (string) or a subheading (["sub", "Label"]).
const menu = [
  ["Welcome Drinks", "Refreshers", [
    "Lime Juice", "Lime Soda Sweet", "Ginger Lime", "Mint Lime",
    "Mango Juice", "Grape Juice", "Water Melon Juice", "Pineapple Juice",
    "Green Mango Juice", "Guava Juice", "Cucumber with Ginger Juice",
    "Orange Juice", "Passion Fruit Juice", "Rose Milk", "Different types of mojitos",
  ]],
  ["Soups", "Veg & Non-Veg", [
    ["sub", "Vegetarian"],
    "Sweet Corn Veg. Soup", "Cream of Veg Soup", "Tomato Soup",
    "Mushroom Soup", "Hot 'N' Sour Veg Soup",
    ["sub", "Non-Vegetarian"],
    "Sweet Corn Chicken Soup", "Sweet Corn Mutton Soup",
    "Cream of Chicken Soup", "Hot 'N' Sour Chicken Soup",
  ]],
  ["Starters", "Veg & Non-Veg", [
    ["sub", "Vegetarian"],
    "Veg Nuggets", "Veg. Lollipop", "French Fries", "Veg Samosa", "Gobi 65",
    ["sub", "Non-Vegetarian"],
    "Chicken Lollipop", "Chicken Nuggets",
    ["sub", "Dips"],
    "Tomato Sauce", "Mint Chutney", "Mayonnaise",
  ]],
  ["Breads", "Assorted", [
    "Rumal Roti", "Vellappam", "Battoora", "Nool Parotta", "Palappam",
    "Pathiri", "Navab Roti", "Noolappam", "Bun Parotta",
  ]],
  ["Rice", "Aromatic", [
    "Fried Rice", "Pulao", "Kashmiri Pulao", "Ghee Rice", "Biriyani Rice",
  ]],
  ["Main Course", "Veg & Non-Veg", [
    ["sub", "Vegetarian"],
    "Veg. Khorma", "Chilli Gobi", "Veg. Stew", "Chena Masala",
    "Paneer Butter Masala", "Mushroom Manjoorian",
    ["sub", "Non-Vegetarian"],
    "Mutton", "Duck", "Chicken", "Beef", "Fish Curry", "Pork",
  ]],
  ["Salads & Sides", "Fresh", [
    "Sarlas & Pickle", "Green Salads", "Crispy Salads", "Cut Fruits",
  ]],
  ["Desserts", "Sweet", [
    "Ice Cream", "Fruit Salads", "Gulab Jamun", "Carrot Halwa",
    "Puddings", "Pastries",
  ]],
  ["Beverages", "Hot & Cold", [
    "Tea / Coffee", "Herbal Tea (live counter)", "Hot Water",
    "20 Litre Water", "300 ml Bottle Water",
  ]],
  ["Live Counters", "Interactive", [
    "Dosa (live counter)", "Veg Soup Counter", "Chat Counter (live)",
    "Thava Fish", "Fish Fry", "Fish Pollichathu",
  ]],
];

// Split a flat item list into groups keyed by their subheading (or null).
function groupItems(items) {
  const groups = [];
  let cur = { label: null, dishes: [] };
  for (const it of items) {
    if (Array.isArray(it)) {
      if (cur.dishes.length) groups.push(cur);
      cur = { label: it[1], dishes: [] };
    } else {
      cur.dishes.push(it);
    }
  }
  if (cur.dishes.length) groups.push(cur);
  return groups;
}

export default function Menu() {
  const [active, setActive] = useState(0);
  const [cat, tag, items] = menu[active];
  const groups = groupItems(items);

  return (
    <div className="menu__wrap">
      <div className="menu__tabs" role="tablist" aria-label="Menu categories">
        {menu.map(([c], i) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`menu__tab${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* keyed on active so it re-animates on each tab switch */}
      <Reveal className="menu__panel" key={active}>
        <div className="menu__panelhead">
          <h3>{cat}</h3>
          <span className="menu__tag">{tag}</span>
        </div>
        <div className="menu__groups">
          {groups.map((g, gi) => (
            <div className="mgroup" key={gi}>
              {g.label && <p className="mgroup__label">{g.label}</p>}
              <ul className="mdishes">
                {g.dishes.map((d) => (
                  <li className="mdish" key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
