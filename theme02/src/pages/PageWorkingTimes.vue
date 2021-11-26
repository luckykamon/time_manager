<template>
  <v-app>
    <WorkingTimes v-if="fetched" :getWorkingTimes="getWorkingTimes"/>
  </v-app>
</template>

<script>
import WorkingTimes from "../components/workingTime/WorkingTimesGet";
import { mapGetters } from "vuex";

export default {
  components: {
    WorkingTimes,
  },
  data() {
    return {
      userId: JSON.parse(localStorage.getItem('user')).userID,
      fetched: false,
    };
  },
  computed: {
    ...mapGetters("workingtimes", ["getWorkingTimes"]),
  },
  mounted() {
    this.$store
      .dispatch("workingtimes/getUserWorkingTimes", this.userId)
      .then(() => {
        this.fetched = true;
      });
  },
};
</script>
