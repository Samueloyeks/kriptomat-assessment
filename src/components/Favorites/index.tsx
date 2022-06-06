import React from "react";
import { CurrencyData } from "../../types/Currency";
import { ReactComponent as ArrowUp } from "../../assets/arrowUp.svg";
import { ReactComponent as ArrowDown } from "../../assets/arrowDown.svg";
import './style.css';

const Favorites = (props: { favorites: CurrencyData[] }) => {
  const { favorites } = props;
  return (
    <div className="favorites">
      <h3>Favorites</h3>
      {favorites.map((favorite: CurrencyData) => (
        <div className="favorite-item">
          <div className="left">
            <img src={favorite.image} alt={favorite.id} />
            <div>
              {favorite.name}
              <div>{favorite.symbol.toUpperCase()}</div>
            </div>
          </div>
          <div className={`right ${favorite.price_change_percentage_24h > 1 ? 'up' : 'down'}`}>
            {`€${favorite.current_price.toLocaleString("en-US")}`}
            {favorite.price_change_percentage_24h > 1 ? (
              <div>
                <ArrowUp />
                {favorite.price_change_percentage_24h}%
              </div>
            ) : (
              <div>
                <ArrowDown />
                {favorite.price_change_percentage_24h}%
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favorites;
