import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";
import CurrencyService from "../../services/CurrencyService";
import { Currency, CurrencyData } from "../../types/Currency";
import CurrencyView from "../CurrencyView";
import Header from "../Header";
import CurrencyList from "./CurrencyList";
import Favorites from "../Favorites";
import { NotificationSeverity } from "../../types/NotificationSeverity";

import "./style.css";

const Currencies = () => {
  const [currencies, setCurrencies] = useState<Array<Currency>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<String>("");
  const [notifSeverity, setNotifSeverity] =
    useState<NotificationSeverity>("success");
  const [notifMessage, setNotifMessage] = useState<String>("");
  const [showNotif, setShowNotif] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<CurrencyData[]>([]);
  const [sortField, setSortField] = useState<
    "name" | "price_change_percentage_24h" | "current_price"
  >("name");
  const [currency, setCurrency] = useState<CurrencyData | null>(null);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    const getSortedData = (listData: Currency[]): Currency[] => {
      let sortedData = [...listData];
      if (sortField.trim() !== "") {
        sortedData = sortedData.sort((a, b) => {
          if (a[sortField] < b[sortField]) {
            return -1;
          }
          if (a[sortField] > b[sortField]) {
            return 1;
          }
          return 0;
        });
      }

      if (search.trim() !== "") {
        setSearch(search.trim());
        sortedData = sortedData.filter((data) => {
          return search
            .toLowerCase()
            .split(" ")
            .every((v: string) => data.name.toLowerCase().includes(v));
        });
      }

      return sortedData;
    };

    const getCurrencies = async () => {
      setLoading(true);
      let result = await CurrencyService.getAll();
      setCurrencies(() => [...getSortedData(result?.data)]);
      setLoading(false);
    };

    getCurrencies().catch(() => {
      setLoading(false);
      setNotifMessage("Error getting currencies");
      setNotifSeverity("error");
      setShowNotif(true);
    });
  }, [search, sortField]);

  const toggleFavorite = (currency: CurrencyData) => {
    return currency.favorite
      ? setFavorites((favorites) => [
          ...favorites.filter((favorite) => favorite.id !== currency.id),
        ])
      : setFavorites((favorites) => [...favorites, currency]);
  };

  return (
    <div>
      <Header />
      <div className="currencies">
        <div className="currencies-list">
          <div className="currencies-list-header">
            {!currency && (
              <>
                Cryptocurrency Prices
                <TextField
                  label="Search"
                  className="search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <Search />,
                    endAdornment: (
                      <div onClick={() => setSearch("")}>
                        <IconButton>
                          <Close />
                        </IconButton>
                      </div>
                    ),
                  }}
                />
              </>
            )}
          </div>
          {loading ? (
            <div className="loading-currencies">
              <div>
                <CircularProgress size={50} color="primary" />
              </div>
            </div>
          ) : !currency ? (
            <CurrencyList
              currencies={currencies}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              setSortField={setSortField}
              sortField={sortField}
              setCurrency={setCurrency}
            />
          ) : (
            <CurrencyView
              favorites={favorites}
              currency={currency}
              setCurrency={setCurrency}
              setLoading={setLoading}
              setNotifMessage={setNotifMessage}
              setNotifSeverity={setNotifSeverity}
              setShowNotif={setShowNotif}
            />
          )}
        </div>
        <div className="favorites-list">
          <Favorites favorites={favorites} />
        </div>
      </div>

      <Snackbar
        open={showNotif}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setShowNotif(false)}
      >
        <Alert
          onClose={() => setShowNotif(false)}
          severity={notifSeverity}
          sx={{ width: "100%" }}
        >
          {notifMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Currencies;
