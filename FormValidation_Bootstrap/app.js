document.querySelector('#name').addEventListener('blur', function (e) {
    const input_text = document.querySelector("#name");
    let re = /^[a-zA-Z]{2,18}$/;
    if (re.test(input_text.value)) {
        input_text.classList.add('is-valid');
        input_text.classList.remove('is-invalid');
    } else {
        input_text.classList.remove('is-valid');
        input_text.classList.add('is-invalid');
    }
    console.log(input_text.classList)
    e.preventDefault();
})

document.querySelector('#zipcode').addEventListener('blur', function (e) {
    const input_text = document.querySelector("#zipcode");
    let re = /^[0-9]{5}(-[0-9]{4})?$/;
    if (re.test(input_text.value)) {
        input_text.classList.add('is-valid');
        input_text.classList.remove('is-invalid');
    } else {
        input_text.classList.remove('is-valid');
        input_text.classList.add('is-invalid');
    }
    console.log(input_text.classList)
    e.preventDefault();
})


document.querySelector('#email').addEventListener('blur', function (e) {
    const input_text = document.querySelector("#email");
    let re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (re.test(input_text.value)) {
        input_text.classList.add('is-valid');
        input_text.classList.remove('is-invalid');
    } else {
        input_text.classList.remove('is-valid');
        input_text.classList.add('is-invalid');
    }
    console.log(input_text.classList)
    e.preventDefault();
})

document.querySelector('#pname').addEventListener('blur', function (e) {
    const input_text = document.querySelector("#pname");
    let re = /^\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
    if (re.test(input_text.value)) {
        input_text.classList.add('is-valid');
        input_text.classList.remove('is-invalid');
    } else {
        input_text.classList.remove('is-valid');
        input_text.classList.add('is-invalid');
    }
    console.log(input_text.classList)
    e.preventDefault();
})
function initializeModalWithCharts() {
    document.querySelectorAll('.loading-overlay').forEach(el => fadeIn(el));
    
    fetch('/run_time_history')
      .then(response => response.json())
      .then(runtimeData => {
        document.querySelectorAll('.loading-overlay').forEach(el => fadeOut(el));
        const enhancedJobsData = mergeJobsWithRuntimeData(jobsData, runtimeData);
        
        const jobsModal = new bootstrap.Modal(document.getElementById('jobsListModal'));
        jobsModal.show();
        initializeJobsDataTable(enhancedJobsData);
      })
      .catch(error => {
        document.querySelectorAll('.loading-overlay').forEach(el => fadeOut(el));
        console.error('Error fetching runtime data:', error);
        
        const enhancedJobsData = jobsData.map(job => ({
          ...job,
          avgRunTime: 'N/A',
          chartData: null
        }));
        
        const jobsModal = new bootstrap.Modal(document.getElementById('jobsListModal'));
        jobsModal.show();
        initializeJobsDataTable(enhancedJobsData);
      });
  }
}

function mergeJobsWithRuntimeData(jobsData, runtimeData) {
  return jobsData.map(job => {
    const runtimeInfo = runtimeData.find(rt => rt.jobname === job.jobname);
    
    if (!runtimeInfo) {
      return {
        ...job,
        avgRunTime: 'N/A',
        chartData: null
      };
    }
    
    const avgRunTime = `${runtimeInfo.AvgRunTime} min`;
    const chartData = createChartData(runtimeInfo);
    
    return {
      ...job,
      avgRunTime,
      chartData
    };
  });
}

function createChartData(runtimeInfo) {
  const dates = Object.keys(runtimeInfo)
    .filter(key => key !== 'jobname' && key !== 'AvgRunTime' && key.match(/^\d{4}-\d{2}-\d{2}$/))
    .sort();

  if (dates.length === 0) return null;

  const labels = dates.map(date => date.substring(5)); // MM-DD format
  const data = dates.map(date => {
    const val = runtimeInfo[date];
    return val === 'No Run' || val === null || val === undefined ? 0 : parseFloat(val);
  });
  const noRunFlags = dates.map(date => runtimeInfo[date] === 'No Run');

  return { labels, data, noRunFlags };
}


function initializeJobsDataTable(enhancedJobsData) {
  let jobsTable;
  if ($.fn.DataTable.isDataTable('#jobsTable')) {
    $('#jobsTable').DataTable().destroy();
  }
  
  jobsTable = $('#jobsTable').DataTable({
    data: enhancedJobsData,
    columns: [
      { 
        data: 'jobname', 
        title: 'Job Name',
        width: '25%'
      },
      { 
        data: 'status', 
        title: 'Status',
        width: '15%'
      },
      {
        data: 'avgRunTime',
        title: 'Avg Runtime',
        width: '15%',
        className: 'text-center'
      },
      {
        data: 'chartData',
        title: 'Last 5 Days Trend',
        width: '30%',
        render: function(data, type, row, meta) {
          if (type === 'display') {
            if (!data) {
              return '<span class="text-muted">No data available</span>';
            }
            const chartId = `chart-${meta.row}`;
            return `<div style="position: relative; overflow: visible; z-index: 1000;">
  <canvas id="${chartId}" class="runtime-chart"></canvas>
</div>`;
          }
          return data ? 'Chart' : 'No data';
        }
      },
      {
        data: null,
        title: 'Actions',
        width: '15%',
        render: function(data, type, row) {
          const status = row.status.toUpperCase();
          const isClickable = ['NOT_STARTED', 'IN_PROGRESS', 'FAILED'].includes(status);
          
          if (isClickable) {
            return `<button class="btn btn-sm btn-primary view-job-details" data-job-name="${row.jobname}" data-job-status="${row.status}">View Flow</button>`;
          } else {
            return `<button class="btn btn-sm btn-secondary" disabled>View Flow</button>`;
          }
        }
      }
    ],
    responsive: true,
    pageLength: 10,
    dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rtip',
    language: {
      search: "",
      searchPlaceholder: "Search jobs...",
      lengthMenu: "Show _MENU_ entries",
      info: "Showing _START_ to _END_ of _TOTAL_ entries",
      infoEmpty: "Showing 0 to 0 of 0 entries",
      infoFiltered: "(filtered from _MAX_ total entries)"
    },
    drawCallback: function() {
      // Create charts after table is drawn
      enhancedJobsData.forEach((job, index) => {
        if (job.chartData) {
          createSparklineChart(`chart-${index}`, job.chartData);
        }
      });
    }
  });
  
  function createSparklineChart(canvasId, chartData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(0, 123, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 123, 255, 0.05)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        data: chartData.data,
        borderColor: '#007bff',
        backgroundColor: gradient,
        borderWidth: 2.5,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointBackgroundColor: '#007bff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#0056b3',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3
      }],
      noRunFlags: chartData.noRunFlags
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler
        }
      },
      scales: {
        x: { display: false },
        y: { display: false, grid: { display: false } }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  });
}

function externalTooltipHandler(context) {
  let tooltipEl = document.getElementById('chartjs-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltipEl.style.color = '#fff';
    tooltipEl.style.padding = '8px 10px';
    tooltipEl.style.borderRadius = '6px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.fontSize = '12px';
    tooltipEl.style.whiteSpace = 'nowrap';
    tooltipEl.style.zIndex = '9999';
    document.body.appendChild(tooltipEl);
  }

  const { chart, tooltip } = context;

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  const labels = chart.data.labels;
  const data = chart.data.datasets[0].data;
  const noRunFlags = chart.data.noRunFlags || [];

  tooltipEl.innerHTML = labels.map((label, i) => {
    return `${label}: ${noRunFlags[i] ? 'No Run' : `${data[i]} min`}`;
  }).join('<br>');

  const canvasRect = chart.canvas.getBoundingClientRect();
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = canvasRect.left + window.pageXOffset + tooltip.caretX + 'px';
  tooltipEl.style.top = canvasRect.top + window.pageYOffset + tooltip.caretY + 'px';
}


// Add CSS for charts
if (!document.querySelector('#chart-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'chart-styles';
  styleElement.textContent = `
    .runtime-chart {
      height: 50px !important;
      width: 250px !important;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
        position: relative;
        z-index: 20;
    }
  #jobsTable {
  table-layout: auto; /* ensures the canvas has space */
}

   

    #jobsTable td {
  overflow: visible !important;
  position: relative;
  z-index: 10;
}
    #jobsTable th {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
    }

    
    .table-responsive {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `;
  document.head.appendChild(styleElement);
}
