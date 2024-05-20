import { getModelForClass } from "@typegoose/typegoose";
import { UserClass } from "./User";
import { ProductClass } from "./Product";
import { CategoryClass } from "./Category";
import { OrderClass } from "./Order";
import { SearchTermClass } from "./SearchTerm";
import { GifClass } from "./Gif";

const Product = getModelForClass(ProductClass);
const User = getModelForClass(UserClass);
const Order = getModelForClass(OrderClass);
const SearchTerm = getModelForClass(SearchTermClass);
const Category = getModelForClass(CategoryClass);
const Gif = getModelForClass(GifClass);

export { User, SearchTerm, Product, Category, Order, Gif };
