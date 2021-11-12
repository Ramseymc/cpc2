<template>
  <div class="about">
    <v-row class="text-center">
      <v-col cols="12" offset="0">
        <v-col cols="6" offset="5">
          <div>
            <v-switch
              v-model="switch1"
              :label="switch1 ? 'Show Planning' : 'Show Investor Input'"
            ></v-switch>
            <v-switch
              v-if="
                this.$store.state.userName === 'Wayne Bruton' ||
                  this.$store.state.userName === 'Wynand Haywood' ||
                  this.$store.state.userName === 'Debbie Landsberg' ||
                  this.$store.state.userName === 'Nick Morgan'
              "
              v-model="switch2"
              :label="switch2 ? 'Hide Summary' : 'Show Summary'"
            ></v-switch>
          </div>
        </v-col>
        <v-card
          class="mx-auto"
          outlined
          max-width="650"
          style="margin: 25px 25px;"
          v-if="switch2"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">
                <v-spacer></v-spacer>
              </div>
              <v-list-item-title class="text-h5 mb-1">
                Investor Capital
              </v-list-item-title>

              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Momentum Account</strong>
                  </div>
                  <div>
                    <strong>{{ momentumTotals }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>

              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Drawn to Date</strong>
                  </div>
                  <div>
                    <strong>{{ drawnTotals }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>

              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Total Investor Capital</strong>
                  </div>
                  <div>
                    <u
                      ><strong>{{ investorCapitalTotal }}</strong></u
                    >
                  </div>
                </div>
              </v-list-item-subtitle>

              <hr />
              <br />
              <v-list-item-title class="text-h5 mb-1">
                Available Security
              </v-list-item-title>

              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Security Allocated</strong>
                  </div>
                  <div>
                    <strong>{{ plannedDrawTotals }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Security Pledged</strong>
                  </div>
                  <div>
                    <strong>{{ pledgedTotals }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Security Planned</strong>
                  </div>
                  <div>
                    <strong>{{ allocatedTotalsP }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  v-if="unallocatedTotalsP !== 'R0.00'"
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%; color: red;"
                >
                  <div>
                    <strong>Security Unallocated</strong>
                  </div>
                  <div>
                    <strong>{{ unallocatedTotalsP }}</strong>
                  </div>
                </div>
                <div
                  v-else
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Security Unallocated</strong>
                  </div>
                  <div>
                    <strong>{{ unallocatedTotalsP }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Total Available Security</strong>
                  </div>
                  <div>
                    <u
                      ><strong>{{ availableSecurityTotal }}</strong></u
                    >
                  </div>
                </div>
              </v-list-item-subtitle>

              <hr />
              <br />
              <v-list-item-title class="text-h5 mb-1">
                Total Funds
              </v-list-item-title>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Funds raised</strong>
                  </div>
                  <div>
                    <strong>{{ subscribedTotals }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Security Available</strong>
                  </div>
                  <div>
                    <strong>{{ totalFundsAvailable }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>

              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Total Funding</strong>
                  </div>
                  <div>
                    <u
                      ><strong>{{ totalFundingInclAvailable }}</strong></u
                    >
                  </div>
                </div>
              </v-list-item-subtitle>
              <hr />
              <br />
              <v-list-item-title class="text-h5 mb-1">
                Interest on Repayment
              </v-list-item-title>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Trust Interest (6.25%)</strong>
                  </div>
                  <div>
                    <strong>{{ trustInterestRepayableAtRepayment }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Contract Interest</strong>
                  </div>
                  <div>
                    <strong>{{ contractInterestRepayableAtRepayment }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Contract Interest (on Available Security)</strong>
                  </div>
                  <div>
                    <strong>{{ totalInteresRepayableAtRepaymentP }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Total Interest</strong>
                  </div>
                  <div>
                    <u
                      ><strong>{{ totalInterestAtRepayment }}</strong></u
                    >
                  </div>
                </div>
              </v-list-item-subtitle>

              <hr />
              <br />
              <v-list-item-title class="text-h5 mb-1">
                Interest - Daily {{ now }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Trust Interest (6.25%)</strong>
                  </div>
                  <div>
                    <strong>{{ trustInterestRepayableAtToday }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Contract Interest</strong>
                  </div>
                  <div>
                    <strong>{{ contractInterestRepayableAtToday }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Contract Interest (on Available Security)</strong>
                  </div>
                  <div>
                    <strong>{{ totalInterestRepayableAtTodayP }}</strong>
                  </div>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-h7 mb-1">
                <div
                  style="display: flex; justify-content: space-between; margin-left:45px;margin-right:45px;font-size:110%;"
                >
                  <div>
                    <strong>Total Interest</strong>
                  </div>
                  <div>
                    <u
                      ><strong>{{ totalInterestAtToday }}</strong></u
                    >
                  </div>
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12" offset="0">
        <!-- desserts -->
        <v-data-table
          style="margin: 25px 25px;"
          :headers="headers"
          :items="filteredData"
          :search="search"
          @current-items="getFiltered"
          dense
          class="elevation-0"
          multi-sort
          :items-per-page="itemsPerPage"
          v-if="switch1"
        >
          <template v-slot:item.sold="{ item }">
            <v-chip :color="getColor(item.sold)" small dark>
              {{ item.sold }}
            </v-chip>
          </template>
          <template v-slot:item.drawn="{ item }">
            <v-simple-checkbox
              color="green"
              v-model="item.drawn"
              disabled
            ></v-simple-checkbox>
          </template>
          <template v-slot:item.drawn2="{ item }">
            <v-chip :color="getColor2(item.drawn2)" small dark>
              {{ item.drawn2 }}
            </v-chip>
          </template>
          <template v-slot:item.unitName="{ item }">
            <v-chip
              :id="item.id"
              small
              @click="redirectToUnitInfo"
              :color="getColor(item.sold)"
              >{{ item.unitName }}</v-chip
            >
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Investor Input</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <span v-if="!indeterminate && (search === '' || search === null)">
                Drawn to date: <strong>{{ drawnTotalsOnly }}</strong>
              </span>
              <v-spacer></v-spacer>
              <v-checkbox
                v-if="search !== '' || search !== null"
                v-model="filterDrawn"
                :indeterminate="indeterminate"
                @change="filterCheckBox"
                :label="checkBoxLabel"
              ></v-checkbox>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
                @keyup="test($event)"
              ></v-text-field>
              <v-spacer></v-spacer>

              <v-dialog v-model="dialog" max-width="1200px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    New Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="3">
                          <v-autocomplete
                            v-model="editedItem.unitName"
                            :items="units"
                            outlined
                            dense
                            chips
                            small-chips
                            item-text="unitName"
                            clearable
                            label="Unit"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            v-model="editedItem.investor_code"
                            label="Code"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            v-model="editedItem.investor"
                            label="Investor"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.pledged"
                            label="Pledged"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-menu
                            v-model="la_email_dateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.la_email_date"
                                label="Email Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearla_email_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="la_email_dateChange"
                              v-model="la_email_date"
                              @input="la_email_dateMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-menu
                            v-model="la_sign_dateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.la_sign_date"
                                label="LA Signed Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearla_sign_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="la_sign_dateChange"
                              v-model="la_sign_date"
                              @input="la_sign_dateMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.attorney_inv_amount"
                            label="Momentum"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-menu
                            v-model="fica_inv_dateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.fica_inv_date"
                                label="Momentum Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearfica_inv_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="fica_inv_dateChange"
                              v-model="fica_inv_date"
                              @input="fica_inv_dateMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.amount"
                            :label="labelName"
                            @blur="showSaveBtn"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-checkbox
                            v-if="showDrawn"
                            v-model="editedItem.drawn"
                            label="Drawn"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-menu
                            v-model="quinteDateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.quinteDate"
                                :label="labelDateName"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearquinteDate"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="quinteDateChange"
                              v-model="quinteDate"
                              @input="quinteDateMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-autocomplete
                            v-model="editedItem.drawNumber"
                            :items="draws"
                            outlined
                            dense
                            chips
                            small-chips
                            item-text="drawNumber"
                            clearable
                            label="Draw"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.drawAdjustment"
                            label="Draw Adjust"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.trust_account_interest"
                            label="Trust Interest"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.interest_rate"
                            label="Investor Interest"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            type="number"
                            v-model="editedItem.opc_comm"
                            label="OPC Rate"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                          <v-menu
                            v-model="repayment_dateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.repayment_date"
                                label="Repayment Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearrepayment_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="repayment_dateChange"
                              v-model="repayment_date"
                              @input="repayment_dateMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-text-field
                            v-model="editedItem.interestPayableAtRepaymentStr"
                            label="Interest at transfer"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                          <v-text-field
                            v-model="editedItem.totalRepayableAtEndStr"
                            label="Repayment Amount"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                          <v-autocomplete
                            v-model="editedItem.actionToTake"
                            :items="['Exit', 'Rollover']"
                            outlined
                            dense
                            chips
                            small-chips
                            clearable
                            label="Action"
                            @change="test2"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="3"
                          v-if="editedItem.actionToTake === 'Rollover'"
                        >
                          <v-text-field
                            type="number"
                            v-model="editedItem.rolloverAmount"
                            label="Rollover Amount (Editable)"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="3"
                          v-if="editedItem.actionToTake === 'Exit'"
                        >
                          <v-text-field
                            v-model="editedItem.exitAmount"
                            label="Repayment Amount"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="3"
                          v-if="editedItem.actionToTake === 'Rollover'"
                        >
                          <v-autocomplete
                            v-model="editedItem.moveInvestorTo"
                            :items="developments"
                            outlined
                            dense
                            chips
                            small-chips
                            item-text="developmentName"
                            clearable
                            label="Development"
                            @change="test2"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="3"
                          style="background-color: salmon"
                          v-if="
                            parseFloat(editedItem.attorney_inv_amount) === 0 &&
                              parseFloat(editedItem.pledged) !== 0 &&
                              parseFloat(editedItem.amount) === 0
                          "
                        >
                          <v-checkbox
                            v-if="
                              parseFloat(editedItem.attorney_inv_amount) ===
                                0 &&
                                parseFloat(editedItem.pledged) !== 0 &&
                                parseFloat(editedItem.amount) === 0
                            "
                            v-model="editedItem.pledgeUsed"
                            label="Pledge Utilised"
                          ></v-checkbox>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="6"
                          style="background-color: salmon"
                          v-if="
                            parseFloat(editedItem.attorney_inv_amount) === 0 &&
                              parseFloat(editedItem.pledged) !== 0 &&
                              parseFloat(editedItem.amount) === 0
                          "
                        >
                          <v-menu
                            v-if="editedItem.pledgeUsed"
                            v-model="pledge_dateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.pledge_date"
                                label="Pledge Utilised Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="clearpledge_date"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              @change="pledge_dateChange"
                              v-model="pledge_date"
                              @input="pledge_dateMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <!-- v-if="showSave" -->
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="green" class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary">
              Reset
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-snackbar v-model="snackbar" top color="amber">
        {{ snackbarMessage }}
        <v-btn color="pink" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12" offset="0">
        <InvestorDataPlanningComp
          @fundsToBeFunded="fundsToBeFunded"
          v-if="!switch1"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
import axios from "axios";
import InvestorDataPlanningComp from "../components/InvestorDataPlanningComp";
let url = process.env.VUE_APP_BASEURL;
export default {
  name: "InvestorData",
  components: {
    InvestorDataPlanningComp
  },
  metaInfo: {
    title: "About us",
    titleTemplate: "CPC - %s",
    meta: [
      {
        name: `description`,
        content: `About CPC here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      allUnits: [],
      developments: [],
      filterDrawn: "",
      indeterminate: true,
      checkBoxCount: 0,
      checkBoxLabel: "No Filter Used (Click to see Drawn, or not Drawn)",
      allocatedTotalsP: 0,
      unallocatedTotalsP: 0,
      drawnTotalsOnly: 0,
      totalInterestRepayableAtTodayP: 0,
      totalInteresRepayableAtRepaymentP: 0,
      contractInterestRepayableAtRepayment: 0,
      contractInterestRepayableAtToday: 0,
      trustInterestRepayableAtRepayment: 0,
      trustInterestRepayableAtToday: 0,
      totalFundingInclAvailable: 0,
      totalInterestAtRepayment: 0,
      totalInterestAtToday: 0,
      investorCapitalTotal: 0,
      availableSecurityTotal: 0,
      now: "",
      switch1: false,
      switch2: false,
      totalFundsAvailable: "",
      labelName: "",
      labelDateName: "",
      showCheckbox: true,
      itemsPerPage: 15,
      unitCount: 0,
      dataTotals: 0,
      availableTotals: 0,
      pleadgedTotals: 0,
      momentumTotals: 0,
      plannedDrawTotals: 0,
      drawnTotals: 0,
      subscribedTotals: 0,
      search: "",
      snackbar: false,
      snackbarMessage: "",
      dialog: false,
      dialogDelete: false,
      sold: [],
      unitType: [],
      showSave: false,
      totalInteresRepayableAtRepayment: 0,
      totalInterestRepayableAtToday: 0,
      // la_email_date: new Date().toISOString().substr(0, 10),
      la_email_date: "2020-06-04",
      la_email_dateMenu: false,
      la_sign_date: new Date().toISOString().substr(0, 10),
      la_sign_dateMenu: false,
      fica_inv_date: new Date().toISOString().substr(0, 10),
      fica_inv_dateMenu: false,
      quinteDate: new Date().toISOString().substr(0, 10),
      quinteDateMenu: false,
      repayment_date: new Date().toISOString().substr(0, 10),
      repayment_dateMenu: false,
      available_date: new Date().toISOString().substr(0, 10),
      available_dateMenu: false,
      pledge_date: new Date().toISOString().substr(0, 10),
      pledge_dateMenu: false,
      draws: [],
      units: [],

      headers: [
        {
          text: "Unit",
          align: "start",
          sortable: true,
          value: "unitName",
          width: 60
        },
        { text: "Code", value: "investor_code", width: 60 },
        { text: "Name", value: "investor", width: 140 },
        // { text: "Available", value: "available", width: 90, align: "end" },
        { text: "Pledged", value: "pledgedStr", width: 120, align: "end" },
        // { text: "email", value: "la_email_date", width: 120 },
        // { text: "signed", value: "la_sign_date", width: 120 },

        {
          text: "Momentum",
          value: "attorney_inv_amountStr",
          width: 120,
          align: "end"
        },
        { text: "Deposit Date", value: "fica_inv_date", width: 120 },
        {
          text: `${this.$store.state.development.developmentName} Amount`,
          // text: "Quinate Amount",
          value: "amountStr",
          width: 150,
          align: "end"
        },
        {
          text: `${this.$store.state.development.developmentName} Date`,
          value: "quinteDate",
          width: 120
        },
        { text: "Drawn", value: "drawn", width: 90 },
        { text: "Drawn", value: "drawn2", width: 90 },
        { text: "Draw", value: "drawNumber", width: 90 },
        // { text: "Draw Adj", value: "drawAdjustment", width: 90 },
        // { text: "Int Rate", value: "interest_rate", width: 60 },
        // { text: "Trust Rate", value: "trust_account_interest", width: 60 },
        // {
        //   text: "Supplementary Rate",
        //   value: "supplementary_interest",
        //   width: 60
        // },
        // { text: "OPC", value: "opc_comm", width: 60 },
        { text: "Int Today", value: "interestPayableAtTodayStr", width: 120 },
        {
          text: "Int Repay",
          value: "interestPayableAtRepaymentStr",
          width: 120
        },
        { text: "Repay", value: "repayment_date", width: 120 },
        // { text: "Drawn2", value: "drawn", width: 120 },
        { text: "Actions", value: "actions", sortable: false, width: 100 }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        amount: 0,
        attorney_inv_amount: 0,
        development: 0,
        draw: null,
        drawAdjustment: 0,
        drawNumber: null,
        fica_inv_date: "",
        drawn: false,
        id: 0,
        interest_rate: 0,
        investor: "",
        investor_code: "",
        la_email_date: "",
        la_sign_date: "",
        available_date: "",
        available: 0,
        opc_comm: 0,
        pledged: 0,
        quinteDate: "",
        repayment_date: "",
        pledge_date: "",
        pledgeUsed: false,
        supplementary_interest: 0,
        trust_account_interest: 0,
        unit: 0,
        unitName: ""
      },
      defaultItem: {
        amount: 0,
        attorney_inv_amount: 0,
        development: 0,
        draw: null,
        drawAdjustment: 0,
        drawNumber: null,
        fica_inv_date: "",
        drawn: false,
        id: 0,
        interest_rate: 0,
        investor: "",
        investor_code: "",
        la_email_date: "",
        la_sign_date: "",
        available_date: "",
        available: 0,
        opc_comm: 0,
        pledged: 0,
        quinteDate: "",
        repayment_date: "",
        pledge_date: "",
        pledgeUsed: false,
        supplementary_interest: 0,
        trust_account_interest: 0,
        unit: 0,
        unitName: ""
      }
    };
  },
  beforeMount() {
    this.pledgedTotals = 0;
  },
  mounted() {
    this.la_email_date = new Date().toISOString().substr(0, 10);
    this.labelName = `${this.$store.state.development.developmentName} Amount`;
    this.labelDateName = `${this.$store.state.development.developmentName} Date`;
    this.now = dayjs(new Date()).format("YYYY-MM-DD");

    this.initialData();
    setTimeout(() => {
      this.switch1 = true;
    }, 300);
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    showDrawn() {
      if (this.editedIndex > -1 && this.editedItem.drawn) {
        return false;
      } else {
        return true;
      }
    },
    totalRecords() {
      return this.desserts.length;
    },
    pageCount() {
      return this.totalRecords / this.itemsPerPage;
    },
    filteredData: function() {
      if (this.filterDrawn === true || this.filterDrawn === false) {
        console.log(this.desserts);
        return this.desserts.filter(el => {
          return el.drawn === this.filterDrawn;
        });
      } else {
        return this.desserts;
      }
      // this.drawnTotals = filteredData.reduce((prev, el) => {
      //   return el.amount + prev
      // })
    }
  },

  watch: {
    search(val) {
      if (val !== "" && val !== null) {
        return (this.itemsPerPage = -1);
      } else {
        return (this.itemsPerPage = 10);
      }
    },
    filteredData() {
      console.log("Filtered DAta::", this.filteredData);
      this.drawnTotalsOnly = this.convertToString(
        this.filteredData.reduce((prev, curr) => {
          return parseFloat(curr.amount) + prev;
        }, 0)
      );
    },

    // showSave() {
    //   if (this.editedItem.amount !== 0 && this.editedItem.amount !== null) {
    //     if (this.editedItem.quinteDate !== "") {
    //       this.showSave = true
    //     } else {
    //       this.showSave = false
    //     }
    //   }

    // },
    dialog(val) {
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.la_email_date !== ""
      ) {
        this.la_email_date = new Date(this.editedItem.la_email_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.la_sign_date !== ""
      ) {
        this.la_sign_date = new Date(this.editedItem.la_sign_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.fica_inv_date !== ""
      ) {
        this.fica_inv_date = new Date(this.editedItem.fica_inv_date)
          .toISOString()
          .substr(0, 10);
      }
      if (this.formTitle === "Edit Item" && this.editedItem.quinteDate !== "") {
        this.quinteDate = new Date(this.editedItem.quinteDate)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.repayment_date !== ""
      ) {
        this.repayment_date = new Date(this.editedItem.repayment_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.available_date !== ""
      ) {
        this.available_date = new Date(this.editedItem.available_date)
          .toISOString()
          .substr(0, 10);
      }
      if (
        this.formTitle === "Edit Item" &&
        this.editedItem.pledge_date !== ""
      ) {
        this.pledge_date = new Date(this.editedItem.pledge_date)
          .toISOString()
          .substr(0, 10);
      }

      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  methods: {
    test2() {
      console.log(this.editedItem);
    },
    filterCheckBox() {
      this.checkBoxCount++;
      console.log(this.checkBoxCount);
      if (this.checkBoxCount > 2) {
        this.indeterminate = true;
        this.filterDrawn = null;
        this.checkBoxCount = 0;
      } else {
        this.indeterminate = false;
      }
      if (this.filterDrawn === true) {
        this.checkBoxLabel = "Filtered on Drawn";
      } else if (this.filterDrawn === false) {
        this.checkBoxLabel = "Filtered on Not Drawn";
      } else {
        this.checkBoxLabel =
          "No Filter Used (Click to see Drawn, or not Drawn)";
      }

      console.log("Checkbox:", this.filterDrawn);
      console.log("Indeterminate:", this.indeterminate);
      // setTimeout(() => {
      // this.indeterminate = true
      // this.filterDrawn = null

      // },1000)
    },
    fundsToBeFunded(event) {
      (this.totalFundsAvailable = event.availableTotalsP),
        (this.allocatedTotalsP = event.allocatedTotalsP);
      this.unallocatedTotalsP = event.unallocatedTotalsP;
      this.totalInterestRepayableAtTodayP =
        event.totalInterestRepayableAtTodayP;
      this.totalInteresRepayableAtRepaymentP =
        event.totalInteresRepayableAtRepaymentP;
    },
    redirectToUnitInfo(event) {
      let infoFiltered = this.desserts.filter(el => {
        return el.id === parseInt(event.currentTarget.id);
      });
      let unitId = infoFiltered[0].unit;
      this.$router.push({ name: `UnitInfo`, params: { id: unitId } });
    },
    show() {
      this.showCheckbox = true;
    },
    test(event) {
      console.log(event);
    },
    showSaveBtn() {
      if (this.editedItem.amount !== 0 && this.editedItem.amount !== null) {
        if (this.editedItem.quinteDate !== "") {
          this.showSave = true;
        } else {
          this.showSave = false;
        }
      } else if (
        this.editedItem.amount !== 0 &&
        this.editedItem.amount !== null &&
        this.editedItem.quinteDate !== 0
      ) {
        this.showSave = true;
      } else if (
        this.editedItem.actionToTake === "Rollover" &&
        (this.editedItem.moveInvestorTo !== null ||
          this.editedItem.moveInvestorTo !== "")
      ) {
        this.showSave = true;
      } else {
        this.showSave = false;
      }
    },
    async initialData() {
      let data = {
        id: this.$store.state.development.id
      };
      await axios({
        method: "post",
        url: `${url}/getInvestmentDataForFile`,
        data: data
      })
        .then(
          response => {
            console.log(response);
            response.data[1].forEach(el => [
              (el.drawNumber = el.drawNumber + ".")
            ]);
            this.developments = response.data[3];
            this.allUnits = response.data[4];
            this.desserts = response.data[0];
            let unitCount = [];
            this.desserts.forEach(el => {
              if (
                el.moveInvestorTo === null ||
                el.moveInvestorTo === undefined
              ) {
                el.moveInvestorTo = this.$store.state.development.developmentName;
              }
              unitCount.push(el.unitName);
              el.amount = el.amount.toFixed(2);
              el.pledged = el.pledged.toFixed(2);
              el.attorney_inv_amount = el.attorney_inv_amount.toFixed(2);
              if (el.fica_inv_date !== null) {
                el.fica_inv_date = dayjs(el.fica_inv_date).format("YYYY-MM-DD");
              } else {
                el.fica_inv_date = "";
              }
              if (el.la_email_date !== null) {
                el.la_email_date = dayjs(el.la_email_date).format("YYYY-MM-DD");
              } else {
                el.la_email_date = "";
              }
              if (el.la_sign_date !== null) {
                el.la_sign_date = dayjs(el.la_sign_date).format("YYYY-MM-DD");
              } else {
                el.la_sign_date = "";
              }
              if (el.quinteDate !== null) {
                el.quinteDate = dayjs(el.quinteDate).format("YYYY-MM-DD");
              } else {
                el.quinteDate = "";
              }
              if (el.repayment_date !== null) {
                el.repayment_date = dayjs(el.repayment_date).format(
                  "YYYY-MM-DD"
                );
              } else {
                el.repayment_date = "";
              }
              if (el.available_date !== null) {
                el.available_date = dayjs(el.available_date).format(
                  "YYYY-MM-DD"
                );
              } else {
                el.available_date = "";
              }
              if (el.pledge_date !== null) {
                el.pledge_date = dayjs(el.pledge_date).format("YYYY-MM-DD");
              } else {
                el.pledge_date = "";
              }

              if (el.drawn === 1) {
                el.drawn = true;
              } else {
                el.drawn = false;
              }
              if (el.pledgeUsed === 1) {
                el.pledgeUsed = true;
              } else {
                el.pledgeUsed = false;
                el.pledge_date = "";
              }
              if (el.drawNumber !== null) {
                el.drawNumber = el.drawNumber + ".";
              }
              // if (el.drawNumber.length === 6) {
              //   console.log(el.drawNumber)
              //   el.drawNumber += " "
              // }

              el.interest_rate = (el.interest_rate * 100).toFixed(2);
              el.opc_comm = (el.opc_comm * 100).toFixed(2);
              el.supplementary_interest = (
                el.supplementary_interest * 100
              ).toFixed(2);
              el.trust_account_interest = (
                el.trust_account_interest * 100
              ).toFixed(2);
              el.drawAdjustment = el.drawAdjustment.toFixed(2);
            });

            unitCount = unitCount.sort();
            unitCount = Array.from(new Set(unitCount));
            this.unitCount = unitCount.length;

            this.desserts.forEach(el => {
              if (el.drawn) {
                el.drawn2 = "true";
              } else {
                el.drawn2 = "false";
              }
              if (el.sold === 1) {
                el.sold = "Yes";
              } else {
                el.sold = "No";
              }
              el.dailyTrustInterest =
                (parseFloat(el.attorney_inv_amount) *
                  ((parseFloat(el.supplementary_interest) +
                    parseFloat(el.trust_account_interest)) /
                    100)) /
                365;
              el.dailyContractInterest =
                (parseFloat(el.amount) * parseFloat(el.interest_rate)) /
                100 /
                365;
              el.trustInteresRepayableAtRepayment = 0;
              el.trustInterestRepayableAtToday = 0;
              if (el.dailyTrustInterest !== 0) {
                if (el.quinteDate !== "" && el.amount !== 0) {
                  el.trustInteresRepayableAtRepayment =
                    el.dailyTrustInterest *
                    (dayjs(el.quinteDate).diff(dayjs(el.fica_inv_date), "day") +
                      1);

                  el.trustInterestRepayableAtToday =
                    el.dailyTrustInterest *
                    dayjs(el.quinteDate).diff(dayjs(el.fica_inv_date), "day");
                  // el.trustInterestRepayableAtToday =
                  //   el.dailyTrustInterest *
                  //   dayjs(new Date()).diff(dayjs(el.fica_inv_date), "day");
                } else if (el.quinteDate == "" && el.amount == 0) {
                  el.trustInteresRepayableAtRepayment =
                    el.dailyTrustInterest *
                    dayjs(el.repayment_date).diff(
                      dayjs(el.fica_inv_date),
                      "day"
                    );
                  el.trustInterestRepayableAtToday =
                    el.dailyTrustInterest *
                    dayjs(new Date()).diff(dayjs(el.fica_inv_date), "day");
                }
              }
              if (
                el.dailyContractInterest !== 0 &&
                el.quinteDate !== "" &&
                el.amount !== 0
              ) {
                el.contractInteresRepayableAtRepayment =
                  el.dailyContractInterest *
                  (dayjs(el.repayment_date).diff(dayjs(el.quinteDate), "day") +
                    1);

                el.contractInterestRepayableAtToday =
                  el.dailyContractInterest *
                  (dayjs(new Date()).diff(dayjs(el.quinteDate), "day") + 1);
              } else {
                el.contractInteresRepayableAtRepayment = 0;
                el.contractInterestRepayableAtToday = 0;
              }
              el.interestPayableAtRepayment = (
                el.trustInteresRepayableAtRepayment +
                el.contractInteresRepayableAtRepayment
              ).toFixed(2);

              el.interestPayableAtToday = (
                el.contractInterestRepayableAtToday +
                el.trustInterestRepayableAtToday
              ).toFixed(2);

              el.pledgedStr = this.convertToString(el.pledged);
              el.attorney_inv_amountStr = this.convertToString(
                el.attorney_inv_amount
              );
              el.amountStr = this.convertToString(el.amount);
              el.interestPayableAtTodayStr = this.convertToString(
                el.interestPayableAtToday
              );
              el.interestPayableAtRepaymentStr = this.convertToString(
                el.interestPayableAtRepayment
              );
              el.totalRepayableAtEnd =
                parseFloat(el.interestPayableAtRepayment) +
                parseFloat(el.amount);
              el.totalRepayableAtEndStr = this.convertToString(
                el.totalRepayableAtEnd
              );
              el.exitAmount = this.convertToString(el.totalRepayableAtEnd);
              el.rolloverAmount = el.totalRepayableAtEnd;
            });

            this.contractInterestRepayableAtRepayment = this.convertToString(
              this.desserts.reduce((prev, el) => {
                return (
                  prev + parseFloat(el.contractInteresRepayableAtRepayment)
                );
              }, 0)
            );
            this.contractInterestRepayableAtToday = this.convertToString(
              this.desserts.reduce((prev, el) => {
                return prev + parseFloat(el.contractInterestRepayableAtToday);
              }, 0)
            );
            this.trustInterestRepayableAtRepayment = this.convertToString(
              this.desserts.reduce((prev, el) => {
                return prev + parseFloat(el.trustInteresRepayableAtRepayment);
              }, 0)
            );
            this.trustInterestRepayableAtToday = this.convertToString(
              this.desserts.reduce((prev, el) => {
                return prev + parseFloat(el.trustInterestRepayableAtToday);
              }, 0)
            );

            this.totalInteresRepayableAtRepayment = this.convertToString(
              this.desserts.reduce((prev, el) => {
                return prev + parseFloat(el.interestPayableAtRepayment);
              }, 0)
            );
            this.totalInterestRepayableAtToday = this.convertToString(
              this.desserts.reduce((prev, el) => {
                return prev + parseFloat(el.interestPayableAtToday);
              }, 0)
            );

            this.draws = response.data[1];
            if (this.$store.state.development.id === 1) {
              this.units = response.data[2].filter(el => {
                return el.unitName.length <= 4;
                // return (el.subsectionName <= 6 && (el.subsection === 10 || el.subsection === 11)) && !el.unitName.includes(".");
                // return (el.subsection <= 6 && (el.subsection === 10 || el.subsection === 11)) && !el.unitName.includes(".");
              });
            } else {
              this.units = response.data[2];
            }
            this.units.sort((a, b) => (a.unitName > b.unitName ? 1 : -1));
            console.log(this.units);
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    // ADD DELETE TEXT HERE
    async deleteItemConfirm() {
      let data = {
        id: this.desserts.filter((el, index) => {
          return index === this.editedIndex;
        })[0].id
      };
      await axios({
        method: "post",
        url: `${url}/deleteInvestmentData`,
        data: data
      })
        .then(
          response => {
            if (response.data.affectedRows === 1) {
              this.snackbarMessage = "Record succesfully Deleted!";
              this.desserts.splice(this.editedIndex, 1);
              this.closeDelete();
            } else {
              this.snackbarMessage = "Error, please try again";
            }
            this.snackbar = true;
          },
          error => {
            console.log(error);
          }
        )
        .catch(e => {
          console.log(e);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (
        this.editedItem.attorney_inv_amount !== 0 ||
        this.editedItem.amount !== 0
      ) {
        this.pledgeUsed = false;
        this.pledge_date = "";
      }
      console.log("EditedItem", this.editedItem);
      // console.log("DrawNumber", this.editedItem.drawNumber);

      if (
        this.editedItem.drawNumber !== null &&
        this.editedItem.drawNumber !== "null."
      ) {
        let draw = this.draws.filter(el => {
          return el.drawNumber === this.editedItem.drawNumber;
        });
        this.editedItem.draw = draw[0].id;
        // console.log("draw", draw);
      } else {
        this.editedItem.draw = null;
      }
      let unit = this.units.filter(el => {
        return el.unitName === this.editedItem.unitName;
      });
      this.editedItem.unit = unit[0].id;
      let filtererd = this.developments.filter(el => {
        return el.developmentName === this.editedItem.moveInvestorTo;
      });
      this.editedItem.moveInvestorToId = filtererd[0].id;
      if (this.editedItem.actionToTake === undefined) {
        this.editedItem.actionToTake = "None";
      }

      this.editedItem.moveInvestorToUnitId = this.allUnits.filter(el => {
        return (
          el.unitName === "None" &&
          el.development === this.editedItem.moveInvestorToId
        );
      })[0].id;

      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
        await axios({
          method: "post",
          url: `${url}/editInvestmentData`,
          data: this.editedItem
        })
          .then(
            response => {
              console.log(response.data);
              if (response.data.length > 1) {
                if (response.data[0].affectedRows === 1) {
                  this.snackbarMessage = "Input succesfully updated!";
                } else {
                  this.snackbarMessage = "Error, please try again";
                }
              } else {
                if (response.data.affectedRows === 1) {
                  this.snackbarMessage = "Input succesfully updated!";
                } else {
                  this.snackbarMessage = "Error, please try again";
                }
              }
              this.snackbar = true;
              this.initialData();
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      } else {
        this.editedItem.development = this.$store.state.development.id;
        await axios({
          method: "post",
          url: `${url}/insertinvestorDetails`,
          data: this.editedItem
        })
          .then(
            response => {
              if (response.data.affectedRows === 1) {
                this.snackbarMessage = "Input succesfully updated!";
                this.desserts.push(this.editedItem);
                this.initialData();
              } else {
                this.snackbarMessage = "Error, please try again";
              }
              this.snackbar = true;
              this.initialData();
            },
            error => {
              console.log(error);
            }
          )
          .catch(e => {
            console.log(e);
          });
      }
      this.close();
    },

    getFiltered(e) {
      if (this.search === "" || this.search === null) {
        // this.dataTotals = this.convertToString(
        this.dataTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            return parseFloat(curr.amount) + prev;
          }, 0)
        );
        this.availableTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            return parseFloat(curr.available) + prev;
          }, 0)
        );

        this.pledgedTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            if (curr.attorney_inv_amount == 0) {
              return parseFloat(curr.pledged) + prev;
            } else {
              return prev;
            }
          }, 0)
        );
        this.momentumTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            return parseFloat(curr.attorney_inv_amount) + prev;
          }, 0) -
            this.desserts.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev;
              }
            }, 0)
        );

        this.drawnTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            if (curr.drawn) {
              return parseFloat(curr.amount) + prev;
            } else {
              return prev;
            }
          }, 0)
        );
        this.plannedDrawTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            if (!curr.drawn && curr.draw !== null) {
              return parseFloat(curr.amount) + prev;
            } else {
              return prev;
            }
          }, 0)
        );

        this.subscribedTotals = this.convertToString(
          this.desserts.reduce((prev, curr) => {
            return parseFloat(curr.pledged) + prev;
          }, 0) -
            this.desserts.reduce((prev, curr) => {
              return parseFloat(curr.attorney_inv_amount) + prev;
            }, 0) +
            this.desserts.reduce((prev, curr) => {
              return parseFloat(curr.attorney_inv_amount) + prev;
            }, 0) -
            this.desserts.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev;
              }
            }, 0) +
            this.desserts.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev;
              }
            }, 0)
        );
      } else {
        this.dataTotals = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.amount) + prev;
          }, 0)
        );
        this.availableTotals = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.available) + prev;
          }, 0)
        );
        this.pledgedTotals = this.convertToString(
          e.reduce((prev, curr) => {
            if (curr.attorney_inv_amount == 0) {
              return parseFloat(curr.pledged) + prev;
            } else {
              return prev;
            }
          }, 0)
        );
        this.momentumTotals = this.convertToString(
          e.reduce((prev, curr) => {
            return parseFloat(curr.attorney_inv_amount) + prev;
          }, 0) -
            e.reduce((prev, curr) => {
              if (curr.drawn) {
                return parseFloat(curr.amount) + prev;
              } else {
                return prev + 0;
              }
            }, 0)
        );
        this.drawnTotals = this.convertToString(
          e.reduce((prev, curr) => {
            if (curr.drawn) {
              return parseFloat(curr.amount) + prev;
            } else {
              return prev + 0;
            }
          }, 0)
        );
        this.plannedDrawTotals = this.convertToString(
          e.reduce((prev, curr) => {
            if (!curr.drawn && curr.draw !== null) {
              return parseFloat(curr.amount) + prev;
            } else {
              return prev;
            }
          }, 0)
        );
        // this.subscribedTotals = this.convertToString(
        this.subscribedTotals =
          e.reduce((prev, curr) => {
            return parseFloat(curr.pledged) + prev;
          }, 0) -
          e.reduce((prev, curr) => {
            return parseFloat(curr.attorney_inv_amount) + prev;
          }, 0);
      }
      setTimeout(() => {
        if (this.switch2) {
          this.switch2 = false;
        }
        this.calculateTotals();
      }, 700);

      // console.log(plannedDrawTotals);
    },
    calculateTotals() {
      this.totalFundingInclAvailable = this.convertToString(
        parseFloat(
          this.subscribedTotals
            .split("")
            .filter(el => {
              return el !== " " && el !== "R";
            })
            .join("")
        ) +
          parseFloat(
            this.totalFundsAvailable
              .split("")
              .filter(el => {
                return el !== " " && el !== "R";
              })
              .join("")
          )
      );

      this.totalInterestAtRepayment = this.convertToString(
        parseFloat(
          this.trustInterestRepayableAtRepayment
            .split("")
            .filter(el => {
              return el !== " " && el !== "R";
            })
            .join("")
        ) +
          parseFloat(
            this.contractInterestRepayableAtRepayment
              .split("")
              .filter(el => {
                return el !== " " && el !== "R";
              })
              .join("")
          ) +
          parseFloat(
            this.totalInteresRepayableAtRepaymentP
              .split("")
              .filter(el => {
                return el !== " " && el !== "R";
              })
              .join("")
          )
      );

      this.totalInterestAtToday = this.convertToString(
        parseFloat(
          this.trustInterestRepayableAtToday
            .split("")
            .filter(el => {
              return el !== " " && el !== "R";
            })
            .join("")
        ) +
          parseFloat(
            this.contractInterestRepayableAtToday
              .split("")
              .filter(el => {
                return el !== " " && el !== "R";
              })
              .join("")
          ) +
          parseFloat(
            this.totalInterestRepayableAtTodayP
              .split("")
              .filter(el => {
                return el !== " " && el !== "R";
              })
              .join("")
          )
      );

      this.investorCapitalTotal = this.convertToString(
        parseFloat(
          this.momentumTotals
            .split("")
            .filter(el => {
              return el !== " " && el !== "R";
            })
            .join("")
        ) +
          parseFloat(
            this.drawnTotals
              .split("")
              .filter(el => {
                return el !== " " && el !== "R";
              })
              .join("")
          )
      );

      this.availableSecurityTotal = this.convertToString(
        parseFloat(
          this.plannedDrawTotals
            .split("")
            .filter(el => {
              return el !== " " && el !== "R";
            })
            .join("")
        ) +
          parseFloat(
            this.pledgedTotals
              .split("")
              .filter(el => {
                return el !== " " && el !== "R";
              })
              .join("")
          ) +
          parseFloat(
            this.allocatedTotalsP
              .split("")
              .filter(el => {
                return el !== " " && el !== "R";
              })
              .join("")
          ) +
          parseFloat(
            this.unallocatedTotalsP
              .split("")
              .filter(el => {
                return el !== " " && el !== "R";
              })
              .join("")
          )
      );
    },
    getColor(sold) {
      if (sold === "Yes") return "green";
      else return "orange";
    },
    getColor2(drawn2) {
      if (drawn2 === "true") return "green";
      else return "orange";
    },
    clearla_email_date() {
      this.editedItem.la_email_date = "";
      this.la_email_date = new Date().toISOString().substr(0, 10);
    },
    clearla_sign_date() {
      this.editedItem.la_sign_date = "";
      this.la_sign_date = new Date().toISOString().substr(0, 10);
    },
    clearfica_inv_date() {
      this.editedItem.fica_inv_date = "";
      this.fica_inv_date = new Date().toISOString().substr(0, 10);
    },
    clearquinteDate() {
      this.editedItem.quinteDate = "";
      this.quinteDate = new Date().toISOString().substr(0, 10);
    },
    clearrepayment_date() {
      this.editedItem.repayment_date = "";
      this.repayment_date = new Date().toISOString().substr(0, 10);
    },
    clearavailable_date() {
      this.editedItem.available_date = "";
      this.available_date = new Date().toISOString().substr(0, 10);
    },
    clearpledge_date() {
      this.editedItem.pledge_date = "";
      this.pledge_date = new Date().toISOString().substr(0, 10);
    },
    la_email_dateChange() {
      this.editedItem.la_email_date = this.la_email_date;
    },
    la_sign_dateChange() {
      this.editedItem.la_sign_date = this.la_sign_date;
    },
    fica_inv_dateChange() {
      this.editedItem.fica_inv_date = this.fica_inv_date;
    },
    quinteDateChange() {
      this.editedItem.quinteDate = this.quinteDate;
      this.showSaveBtn();
    },
    repayment_dateChange() {
      this.editedItem.repayment_date = this.repayment_date;
    },
    available_dateChange() {
      this.editedItem.available_date = this.available_date;
    },
    pledge_dateChange() {
      this.editedItem.pledge_date = this.pledge_date;
    }
  }
};
</script>

<style scoped>
.layout {
  display: inline-block;
  width: 95%;
}
.corner {
  background-color: orange;
  cursor: pointer;
}
svg {
  height: 80vh;
}
rect:hover {
  cursor: pointer;
}
path:hover {
  cursor: pointer;
}
.toolbar__items {
  flex-wrap: wrap;
}
.check {
  width: 25px;
  height: 25px;
  border: 3px solid black;
}
</style>
