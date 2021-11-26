<template>
  <v-card elevation="2" class="user-card-parent" color="#eeeeee">
    <v-card-title>Administrer les utilisateurs</v-card-title>
    <v-data-table
      :headers="headers"
      :items="users"
      sort-by="userID"
      class="elevation-1 table"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>USERS CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-col class="d-flex" cols="6" sm="3">
            <v-select
              :items="['By userID', 'By email & username']"
              v-model="typeSearch"
              label="Recherche par"
              hide-details
            ></v-select>
          </v-col>
          <v-col v-if="typeSearch === 'By userID'" cols="6" sm="6" md="3">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              placeholder="your search"
              hide-details
              @input="initialize"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col v-if="typeSearch !== 'By userID'" cols="6" sm="6" md="3">
            <v-text-field
              v-model="email"
              append-icon="mdi-magnify"
              label="email"
              placeholder="search by email"
              hide-details
              @input="initialize"
              type="email"
            ></v-text-field>
          </v-col>
          <v-col v-if="typeSearch !== 'By userID'" cols="6" sm="6" md="3">
            <v-text-field
              v-model="username"
              append-icon="mdi-magnify"
              label="username"
              placeholder="search by username"
              hide-details
              @input="initialize"
              type="text"
            ></v-text-field>
          </v-col>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New User
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.username"
                        label="username"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.email"
                        label="email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.role"
                        label="rôle"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.password"
                        label="password"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">
                Are you sure you want to delete this item?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                  OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn color="warning" fab x-small dark @click="editItem(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn color="error" fab x-small dark @click="deleteItem(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Users',
  data() {
    return {
      search: null,
      email: '',
      username: '',
      role: '',
      typeSearch: 'By userID',
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'userID',
          align: 'start',
          sortable: false,
          value: 'userID',
        },
        { text: 'username', value: 'username' },
        { text: 'email', value: 'email' },
        { text: 'rôle', value: 'role' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      data: [],
      editedIndex: -1,
      editedItem: {
        userID: null,
        username: '',
        email: '',
        role: '',
        password: '',
      },
      defaultItem: {
        userID: null,
        username: '',
        email: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      copyrights: 'users/copyright',
      users: 'users/getUser',
    }),
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  mounted() {},

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  methods: {
    initialize() {
      if (this.typeSearch === 'By userID') {
        if (
          this.search !== null &&
          this.search !== undefined &&
          this.search !== ''
        ) {
          this.$store.dispatch('users/getUserById', parseInt(this.search))
        }
      } else {
        this.$store.dispatch('users/getUsersByEmailUsername', {
          getEmail: this.email,
          getUsername: this.username,
        })
      }
    },
    editItem(item) {
      this.editedIndex = this.data.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.data.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.data.splice(this.editedIndex, 1)
      this.$store.dispatch('users/deleteUser', this.editedItem.userID)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.data[this.editedIndex], this.editedItem)
      } else {
        this.data.push(this.editedItem)
      }
      if (this.editedItem.userID === null) {
        this.$store.dispatch('users/addUser', this.editedItem)
      } else {
        this.$store.dispatch('users/updateUser', this.editedItem)
      }
      this.close()
    },
  },
}
</script>

<style>
.table {
  margin: 0.5em;
}
.user-card-parent {
  margin: 0.5em;
  text-align: center;
  height: 100%;
}
</style>
