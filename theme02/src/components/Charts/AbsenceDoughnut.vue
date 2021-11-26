<script>
import {Doughnut} from "vue-chartjs";


export default {

  data() {
    return {
      PresenceAbsence: [0, 0],

    };
  },


  // props: {
  //   teamList: {
  //     required: true
  //   }
  // },
  extends: Doughnut,
  methods: {
    rendChartABS(PresenceAbsence) {
      this.PresenceAbsence = PresenceAbsence


      this.renderChart(
          {
            labels: [
              "Présence",
              "Absence",
            ],
            datasets: [
              {
                label: "Présence",
                backgroundColor: ["#05b613", "#940202"],
                data: this.PresenceAbsence,
              },
            ],

          },
          {responsive: true, maintainAspectRatio: false}
      );


    }
  },


  mounted() {


  }
};
</script>
