import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import { ReactComponent as FilledStar } from "../../assets/filledStar.svg";
import { ReactComponent as ArrowUp } from "../../assets/arrowUp.svg";
import { ReactComponent as ArrowDown } from "../../assets/arrowDown.svg";
import { ReactComponent as Star } from "../../assets/star.svg";
import { CurrencyData } from "../../types/Currency";
import { TimeLine } from "../../types/TimeLine";
import CurrencyService from "../../services/CurrencyService";
import "./style.css";

const CurrencyView = (props: {
  currency: CurrencyData | null;
  setCurrency: Function;
  setLoading: Function;
  setNotifMessage: Function;
  setNotifSeverity: Function;
  setShowNotif: Function;
  favorites: CurrencyData[];
}) => {
  const {
    currency,
    setCurrency,
    setLoading,
    setNotifMessage,
    setNotifSeverity,
    setShowNotif,
    favorites,
  } = props;
  const [series, setSeries] = useState([{ data: [] }]);
  const [options] = useState<ApexOptions>({
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
    },
  });

  const [selection, setSelection] = useState<TimeLine>("one_year");

  useEffect(() => {
    setLoading(true);
    const getCurrency = async () => {
      setLoading(true);
      let result = await CurrencyService.get(
        currency?.id,
        Math.round(new Date("23 Jan 2021").getTime() / 1000),
        Math.round(new Date("27 Feb 2022").getTime() / 1000)
      );
      setSeries(() => [{ data: result?.data?.prices }]);
      setLoading(false);
    };

    getCurrency().catch(() => {
      setLoading(false);
      setNotifMessage("Error getting currency data");
      setNotifSeverity("error");
      setShowNotif(true);
    });
  }, []);

  const updateData = (timeline: TimeLine) => {
    setSelection(timeline);

    switch (timeline) {
      case "one_month":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("28 Jan 2021").getTime(),
          new Date("27 Feb 2022").getTime()
        );
        break;
      case "six_months":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("27 Sep 2021").getTime(),
          new Date("27 Feb 2022").getTime()
        );
        break;
      case "one_year":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("27 Feb 2021").getTime(),
          new Date("27 Feb 2022").getTime()
        );
        break;
      case "ytd":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("01 Jan 2021").getTime(),
          new Date("27 Feb 2022").getTime()
        );
        break;
      case "all":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("23 Jan 2021").getTime(),
          new Date("27 Feb 2022").getTime()
        );
        break;
      default:
    }
  };

  return (
    <div id="chart">
      <button onClick={() => setCurrency(null)} className="back-btn">
        <ArrowLeft />
      </button>
      <header className="chart-header">
        <div className="left">
          <img src={currency?.image} alt={currency?.symbol} />
          <div>
            {currency?.name}
            {currency?.price_change_percentage_24h &&
            currency.price_change_percentage_24h > 1 ? (
              <div className="up">
                <ArrowUp />
                {currency?.price_change_percentage_24h}%
              </div>
            ) : (
              <div className="down">
                <ArrowDown />
                {currency?.price_change_percentage_24h}%
              </div>
            )}
          </div>
          {favorites.findIndex((favorite) => favorite.id === currency?.id) >
          -1 ? (
            <FilledStar />
          ) : (
            <Star />
          )}
        </div>
        <div className="right">
          {`€${currency?.current_price.toLocaleString("en-US")}`}
          <div>
            <span>
              24h Low{" "}
              <span>{`€${currency?.low_24h.toLocaleString("en-US")}`}</span>
            </span>
            <span>
              24h High{" "}
              <span>{`€${currency?.high_24h.toLocaleString("en-US")}`}</span>
            </span>
          </div>
        </div>
      </header>

      <div id="chart-timeline">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
      <div className="toolbar">
        <button
          id="one_month"
          onClick={() => updateData("one_month")}
          className={selection === "one_month" ? "active" : ""}
        >
          1M
        </button>
        &nbsp;
        <button
          id="six_months"
          onClick={() => updateData("six_months")}
          className={selection === "six_months" ? "active" : ""}
        >
          6M
        </button>
        &nbsp;
        <button
          id="one_year"
          onClick={() => updateData("one_year")}
          className={selection === "one_year" ? "active" : ""}
        >
          1Y
        </button>
        &nbsp;
        <button
          id="ytd"
          onClick={() => updateData("ytd")}
          className={selection === "ytd" ? "active" : ""}
        >
          YTD
        </button>
        &nbsp;
        <button
          id="all"
          onClick={() => updateData("all")}
          className={selection === "all" ? "active" : ""}
        >
          ALL
        </button>
      </div>
      <div className="table-footer">
      <button >Buy, Sell or Exchange Bitcoin</button>
      </div>
    </div>
  );
};
export default CurrencyView;
