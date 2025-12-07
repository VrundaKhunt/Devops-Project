// List of JSON reports to load
const files = [
  "../reports/order-service-trivy.json",
  "../reports/payment-service-trivy.json",
  "../reports/inventory-service-trivy.json",
  "../reports/user-service-trivy.json",
  "../reports/product-service-trivy.json"
];

const resultsDiv = document.getElementById("results");

files.forEach(file => {
  fetch(file)
    .then(res => res.json())
    .then(data => {
      const section = document.createElement("div");
      section.classList.add("report-box");

      const vulnerabilities = data.Results?.[0]?.Vulnerabilities || [];
      const high = vulnerabilities.filter(v => v.Severity === "HIGH");
      const critical = vulnerabilities.filter(v => v.Severity === "CRITICAL");

      section.innerHTML = `
        <h2>${file.replace("../reports/", "")}</h2>
        <p><strong>High:</strong> ${high.length}</p>
        <p><strong>Critical:</strong> ${critical.length}</p>
        <hr>
      `;

      resultsDiv.appendChild(section);
    })
    .catch(err => {
      const errorBox = document.createElement("div");
      errorBox.innerHTML = `<p>Error loading ${file}</p>`;
      resultsDiv.appendChild(errorBox);
    });
});
