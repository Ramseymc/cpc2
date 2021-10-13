import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    isLoggedIn: false,
    userId: null,
    userRole: null,
    userTitle: null,
    userName: null,
    userEmail: null,
    userMobile: null,
    token: null,
    development: {
      id: null,
      developmentName: null
    }
    // smartsheetToken: null
    // gridWidth: true
  },
  mutations: {
    setUser(state, user) {
      state.isLoggedIn = true;
      state.userId = user.id;
      state.userRole = user.userRole;
      state.userName = user.userName;
      state.userEmail = user.userEmail;
      state.userMobile = user.userMobile;
      state.token = user.token;
      state.userTitle = user.userTitle;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userId = null;
      state.userRole = null;
      state.userName = null;
      state.userEmail = null;
      state.userMobile = null;
      state.token = null;
      state.userTitle = null;
      state.development.id = null;
      state.development.developmentName = null;
    },
    chooseDevelopment(state, development) {
      state.development.id = development.id;
      state.development.developmentName = development.developmentName;
    }
    // setSmartsheetToken(state) {
    //   state.smartsheetToken = true
    // },
    // clearSmartsheetToken(state) {
    //   state.smartsheetToken = false
    // }

    // viewGrid(state) {
    //   console.log(state.gridWidth)
    //   state.gridWidth = !state.gridWidth

    //   // if (state.gridWidth == 350) {
    //   //   state.gridWidth = 0
    //   // } else {
    //   //   state.gridWidth = 350
    //   // }
    // }
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    logout({ commit }) {
      commit("logout");
    },
    // viewGrid({ commit }) {
    //   commit("viewGrid");
    // },
    chooseDevelopment({ commit }, development) {
      commit("chooseDevelopment", development);
    }
  },
  modules: {}
});
