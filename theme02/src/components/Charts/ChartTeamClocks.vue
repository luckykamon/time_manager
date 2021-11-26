<script>
import {Line} from "vue-chartjs";


export default {

  data() {
    return {
      gradient: null,
      gradient2: null,
      dataChart: [[]], //Premier étant les users, deuxieme étant leurs heures de taf totales
      theDataSet: [[0]],
      colors: ["#FC2525", "#fc6d20", "#efc104", "#5efc20", "#20fcc9", "#204cfc", "#8320fc", "#d083c0", "#FC2020"],
      gradients: null,
      rawListFromParent: [[0]],
      userIDConnected: 1,

    };
  },


  props: {
    teamList: {
      required: true
    }
  },
  extends: Line,
  methods: {
    rendAreaChart(FinalClockList, usernamesList) {

      this.rawListFromParent = FinalClockList;
      this.dataChart = this.rawListFromParent


      for (let i = 0; i < usernamesList.length; i++) {
        this.theDataSet[i] = {
          label: usernamesList[i],
          borderColor: this.colors[i],
          pointBackgroundColor: "white",
          borderWidth: 1,
          pointBorderColor: "white",
          backgroundColor: this.gradients[i],
          data: this.dataChart[i]
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
              "Dimanche"
            ],
            datasets: this.theDataSet
          },
          {responsive: true, maintainAspectRatio: false}
      );
    }
  },


  mounted() {


    this.gradient = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
    this.gradient3 = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
    this.gradient4 = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
    this.gradient5 = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);


    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(255,115,0,0.9)");
    this.gradient2.addColorStop(0.5, "rgba(245,101,0,0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.gradient3.addColorStop(0, "rgba(252,195,22,0.9)");
    this.gradient3.addColorStop(0.5, "rgba(255,221,0,0.25)");
    this.gradient3.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.gradient4.addColorStop(0, "rgba(34,255,0,0.9)");
    this.gradient4.addColorStop(0.5, "rgba(34,255,0,0.25)");
    this.gradient4.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.gradient5.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient5.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient5.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.gradients = [this.gradient, this.gradient2, this.gradient3, this.gradient4, this.gradient5]
  }
};
</script>
