const TRADINGVIEW_WIDGET_BASE =
  "https://www.tradingview-widget.com/embed-widget/advanced-chart/"

type TradingViewChartOptions = {
  symbol: string
  interval?: string
}

export function buildTradingViewSymbol(ticker: string) {
  const clean = ticker.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
  if (!clean) return "BINANCE:SOLUSDT"

  // Best-effort symbol for the free TV widget; user can change symbol in-chart.
  return `BINANCE:${clean}USDT`
}

export function buildTradingViewAdvancedChartUrl({
  symbol,
  interval = "1",
}: TradingViewChartOptions) {
  const config = {
    autosize: true,
    symbol,
    interval,
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    enable_publishing: false,
    allow_symbol_change: true,
    hide_top_toolbar: false,
    hide_legend: false,
    save_image: false,
    calendar: false,
    hide_volume: false,
    support_host: "https://www.tradingview.com",
  }

  return `${TRADINGVIEW_WIDGET_BASE}?locale=en#${encodeURIComponent(JSON.stringify(config))}`
}
