var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Prod 1', 'Prod 2', 'Prod 3'],
        datasets: [{
            data: [40, 20, 30],
            backgroundColor: ['#1E88E5', '#42A5F5', '#38719E']
        }]
    },
    options: {
        plugins: {
            legend: {
                position: 'right'
            }
        },
        maintainAspectRatio: false,
        responsive: true
    }
});