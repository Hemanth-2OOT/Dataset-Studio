import Plot from "react-plotly.js";

export default function ChartViewer({ chart }) {
  if (!chart) return null;

  const commonLayout = {
    autosize: true,
    height: 400,
    margin: {
      l: 50,
      r: 20,
      t: 50,
      b: 50,
    },
  };

  if (chart.type === "histogram") {
    return (
      <Plot
        data={[
          {
            x: chart.values,
            type: "histogram",
          },
        ]}
        layout={{
          ...commonLayout,
          title: `Distribution of ${chart.column}`,
        }}
        style={{
          width: "100%",
        }}
        config={{
          responsive: true,
          displaylogo: false,
        }}
      />
    );
  }

  if (chart.type === "scatter") {
    return (
      <Plot
        data={[
          {
            x: chart.x,
            y: chart.y,
            mode: "markers",
            type: "scatter",
          },
        ]}
        layout={{
          ...commonLayout,
          title: `${chart.x_col} vs ${chart.y_col}`,
          xaxis: {
            title: chart.x_col,
          },
          yaxis: {
            title: chart.y_col,
          },
        }}
        style={{
          width: "100%",
        }}
        config={{
          responsive: true,
          displaylogo: false,
        }}
      />
    );
  }

  if (chart.type === "bar") {
    return (
      <Plot
        data={[
          {
            x: chart.labels,
            y: chart.values,
            type: "bar",
          },
        ]}
        layout={{
          ...commonLayout,
          title: `${chart.column} Distribution`,
        }}
        style={{
          width: "100%",
        }}
        config={{
          responsive: true,
          displaylogo: false,
        }}
      />
    );
  }

  if (chart.type === "pie") {
    return (
      <Plot
        data={[
          {
            labels: chart.labels,
            values: chart.values,
            type: "pie",
          },
        ]}
        layout={{
          ...commonLayout,
          title: `${chart.column} Breakdown`,
        }}
        style={{
          width: "100%",
        }}
        config={{
          responsive: true,
          displaylogo: false,
        }}
      />
    );
  }

  if (chart.type === "heatmap") {
    return (
      <Plot
        data={[
          {
            z: chart.values,
            x: chart.columns,
            y: chart.columns,
            type: "heatmap",
          },
        ]}
        layout={{
          ...commonLayout,
          title: "Correlation Matrix",
        }}
        style={{
          width: "100%",
        }}
        config={{
          responsive: true,
          displaylogo: false,
        }}
      />
    );
  }

  return (
    <div>
      Unsupported chart type:
      {" "}
      {chart.type}
    </div>
  );
}