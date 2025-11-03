import { categories } from "../data/category.js";

export default function getRandomWord(){
    const randomIndex= Math.floor(Math.random()*categories.length);
    return categories[randomIndex];
}