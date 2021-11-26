<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm12 md12>
            <v-card class="elevation-12">
              <v-toolbar dark color="#027186">
                <v-toolbar-title>Connexion</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="mdi-account"
                    color="#027186"
                    name="login"
                    label="Login"
                    type="text"
                    v-model="username"
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-text-field
                    :type="showPassword ? 'text' : 'password'"
                    color="#027186"
                    id="password"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    name="password"
                    label="Password"
                    v-model="password"
                    :rules="[rules.required]"
                    @keyup="connectionOnKeyup()"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#027186" type="submit" @click="submit" dark>
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      rules: {
        required: (value) => !!value || 'Obligatoire.',
      },
    }
  },
  created() {
    // reset login status
    this.$store.dispatch('account/logout')
  },
  methods: {
    connectionOnKeyup() {
      if (event.keyCode === 13) {
        this.submit()
      }
    },
    submit() {
      const { username, password } = this
      if (username && password) {
        this.$store.dispatch('account/login', { username, password })
      }
    },
  },
}


</script>
