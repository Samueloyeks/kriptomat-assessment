import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { ReactComponent as FilledStar } from "../../assets/filledStar.svg";
import { ReactComponent as ArrowUp } from "../../assets/arrowUp.svg";
import { ReactComponent as ArrowDown } from "../../assets/arrowDown.svg";
import { ReactComponent as Star } from "../../assets/star.svg";
import { Currency, CurrencyData } from "../../types/Currency";
import "./style.css";

interface Column {
  id: "name" | "price_change_percentage_24h" | "current_price" | "favorite";
  label: string;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Currency", minWidth: 300, align: "left" },
  {
    id: "price_change_percentage_24h",
    label: "24h %",
    minWidth: 100,
    align: "right",
  },
  {
    id: "current_price",
    label: "Price",
    minWidth: 100,
    format: (value: number) => value.toLocaleString("en-US"),
    align: "right",
  },
  {
    id: "favorite",
    label: "Favorite",
    minWidth: 50,
    align: "center",
  },
];

const CurrencyList = (props: {
  currencies: Currency[];
  favorites: CurrencyData[];
  toggleFavorite: Function;
  setSortField: Function;
  sortField: String;
  setCurrency: Function;
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    currencies,
    favorites,
    toggleFavorite,
    setSortField,
    sortField,
    setCurrency,
  } = props;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  function createData({
    id,
    symbol,
    name,
    image,
    current_price,
    price_change_percentage_24h,
    high_24h,
    low_24h,
  }: Currency): CurrencyData {
    const favorite = favorites.findIndex((favorite) => favorite.id === id) > -1;
    return {
      id,
      symbol,
      name,
      image,
      current_price,
      price_change_percentage_24h,
      favorite,
      high_24h,
      low_24h,
    };
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getTableCellComponent = (
    column: Column,
    currency: CurrencyData,
    value: any
  ) => {
    switch (column.id) {
      case "name":
        return (
          <span>
            <img
              src={currency.image}
              alt={currency.symbol}
              className="currency-icon"
            />
            {currency.name} <span>{currency.symbol.toUpperCase()}</span>
          </span>
        );
      case "price_change_percentage_24h":
        return (
          <span
            className={currency.price_change_percentage_24h > 1 ? "up" : "down"}
          >
            {currency.price_change_percentage_24h > 1 ? (
              <span>
                <ArrowUp />
                {currency.price_change_percentage_24h}%
              </span>
            ) : (
              <span>
                <ArrowDown />
                {currency.price_change_percentage_24h}%
              </span>
            )}
          </span>
        );
      case "favorite":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(currency);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="favorite-button"
          >
            {favorites.findIndex((favorite) => favorite.id === currency.id) >
            -1 ? (
              <FilledStar />
            ) : (
              <Star />
            )}
          </button>
        );
      case "current_price":
        return `€${column.format?.(value)}`;
      default:
        return value;
    }
  };

  const getHeadCellComponent = (column: Column) => {
    const { id, label } = column;
    if (
      id === "name" ||
      id === "price_change_percentage_24h" ||
      id === "current_price"
    ) {
      return (
        <button onClick={() => setSortField(id)} className="table-button">
          {sortField === id ? <ArrowDownward className="sort-arrow" /> : null}{" "}
          {label}
        </button>
      );
    }

    return label;
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {getHeadCellComponent(column)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currencies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any) => {
                row = createData(row);

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={() => {
                      setCurrency(row);
                    }}
                    className="table-row"
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={`table-cell-${column.id}`}
                        >
                          {getTableCellComponent(column, row, value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={currencies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CurrencyList;
