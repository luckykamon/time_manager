<script>
import {Bar} from "vue-chartjs";

export default {
  data() {
    return {

      workingtimesList: [0],
      dataChart: [0, 0, 0, 0, 0, 0, 0],
      dataChart2: [0, 0, 0, 0, 0, 0, 0],
      dataChart3: [0, 0, 0, 0, 0, 0, 0]


    };
  },
  props: {
    GETworkingtimesListBar: {
      required: true
    },
    ['testRend']: {}

  },
  extends: Bar,
  methods: {

    rendChartBar() {
      this.dataChart = [0, 0, 0, 0, 0, 0, 0]
      this.dataChart2 = [0, 0, 0, 0, 0, 0, 0]
      this.dataChart3 = [0, 0, 0, 0, 0, 0, 0]
      this.workingtimesList = this.GETworkingtimesListBar;
      let now = new Date();
      let adjustmentDay = now.getDay() - 1;
      let thisMonday = (now.getDate() - adjustmentDay);
      let thisMonth = now.getMonth();
      let thisYear = now.getFullYear();


      for (let i = 0; i < this.workingtimesList.length; i++) {
        let debut = new Date(this.workingtimesList[i].start)
        let fin = new Date(this.workingtimesList[i].end)
        let heureSupp = fin.getHours() - debut.getHours() - 8;
        if (heureSupp < 0) {
          heureSupp = 0
        }

        for (let j = 0; j < 7; j++) {
          if (debut.getFullYear() === thisYear && debut.getMonth() === thisMonth && debut.getDate() === (thisMonday + j)) {
            // HEURES DE JOUR
            if (debut.getHours() >= 8 && debut.getHours() < 18) {
              this.dataChart[j] += Math.min(fin.getHours() - debut.getHours(), 18 - debut.getHours(), 8);
            } else if (fin.getHours() <= 18 && fin.getHours() > 8) {
              this.dataChart[j] = Math.min(fin.getHours() - 8, 8);
            }
            // HEURES SUPP
            if (heureSupp > 0) {
              this.dataChart2[j] += heureSupp;
            }
            // HEURES DE NUIT POUR LE RESTE
            if (fin.getHours() - debut.getHours() > (this.dataChart[j] + heureSupp)) {
              this.dataChart3[j] += fin.getHours() - debut.getHours() - heureSupp - this.dataChart[j]
            }
          }
        }

      }

      this.renderChart(
          {
            labels: [
              "Lundi",
              "Mardi",
              "Mercredi",
              "Jeudi",
              "Vendredi",
              "Samedi",
              "Dimanche",
            ],
            datasets: [
              {
                label: "Heures de jour",
                backgroundColor: "#f8df79",

                data: this.dataChart,


              },
              {
                label: "Heures supplémentaires",
                backgroundColor: "#ec8c02",
                data: this.dataChart2,
              },
              {
                label: "Heures de nuit",
                backgroundColor: "#03336c",
                data: this.dataChart3,

              }

            ]
          },
          {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: [{
                stacked: true,
                categoryPercentage: 0.5,
                barPercentage: 1
              }],
              y: {
                stacked: true
              }

            }
          }
      );
    }
  },

  mounted() {


  }



  // AFTER MOUNTED
};
</script>


<style scoped>

</style>