<!-- 
          TYPE: Component
          NAME: ClientUpdate
       PURPOSE: Dialog form to maintain(update) a client sales 
          DATE: July 2021
          AUTH: Connor McLean, Wayne Bruton

          it has edit data, how do you use that - would you launch it with the data given to it from the previous screen, or would you have it run a call 
 -->
<template>
  <v-container>
    <div class="about">
      <br /><br /><br />
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="900px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Client Info </span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="4" md="4" offset="1" row>
                    <v-radio-group
                      v-model="editData[0].salePerson"
                      @change="naturalTrust"
                    >
                      <v-radio
                        label="Individual"
                        color="black"
                        value="person"
                      ></v-radio>
                      <v-radio
                        label="Company / Trust"
                        color="red darken-3"
                        value="Legal"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12" sm="4" md="4" offset="1">
                    <v-radio-group
                      v-if="editData[0].salePerson === 'person'"
                      v-model="editData[0].saleBuyers"
                    >
                      <v-radio
                        name="active"
                        label="1 Person"
                        :value="1"
                      ></v-radio>
                      <v-radio
                        name="active"
                        label="2 People"
                        :value="2"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12">
                    <hr color="red" />
                  </v-col>
                  <!-- <div style="width: 100%;"> -->
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    v-if="editData[0].salePerson === 'Legal'"
                    style="background-color: lightgrey"
                  >
                    <v-text-field
                      v-model="editData[0].trustName"
                      label="Trust / Company name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    v-if="editData[0].salePerson === 'Legal'"
                    style="background-color: lightgrey"
                  >
                    <v-text-field
                      v-model="editData[0].trustNumber"
                      label="Trust / Company Number"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    style="background-color: lightgrey"
                  >
                    <v-radio-group
                      v-model="editData[0].marital"
                      row
                      v-if="editData[0].salePerson === 'person'"
                    >
                      <v-radio
                        label="Not married"
                        color="black"
                        value="Not married"
                      ></v-radio>
                      <v-radio
                        label="Married - ANC"
                        color="red darken-3"
                        value="Married - ANC"
                      ></v-radio>
                      <v-radio
                        label="Married - COP"
                        color="red darken-3"
                        value="Married - COP"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                    style="background-color: lightgrey"
                  >
                    <v-text-field
                      v-model="editData[0].firstname"
                      :label="firstNameLabel"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                    style="background-color: lightgrey"
                  >
                    <v-text-field
                      v-model="editData[0].lastname"
                      :label="lastNameLabel"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" style="background-color: lightgrey">
                    <v-text-field
                      v-model="editData[0].iDNumber"
                      label="ID Number*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" style="background-color: lightgrey">
                    <v-text-field
                      v-model="editData[0].email"
                      label="Email*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" style="background-color: lightgrey">
                    <span>Mobile - Required</span>
                    <VuePhoneNumberInput
                      id="phoneNumber1"
                      v-model="editData[0].mobile"
                      ref="mobile"
                      clearable
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                      @update="mobileStuff"
                    />
                  </v-col>
                  <v-col cols="6" style="background-color: lightgrey">
                    <span>Landline</span>
                    <VuePhoneNumberInput
                      id="phoneNumber2"
                      v-model="editData[0].landline"
                      ref="landline"
                      clearable
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                      @update="mobileStuff"
                    />
                  </v-col>
                  <v-col cols="6" style="background-color: lightgrey">
                    <v-textarea
                      v-model="editData[0].postalAddress"
                      label="Postal Address"
                      required
                      placeholder="Postal Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="6" style="background-color: lightgrey">
                    <v-textarea
                      v-model="editData[0].residentialAddress"
                      label="Residential Address"
                      required
                      placeholder="Residential Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>

                  <!-- </div> -->
                  <v-col
                    cols="12"
                    v-if=" (editData[0].salePerson === 'person' && editData[0].saleBuyers === '2') || editData[0].salePerson === 'Legal'  "
                  >
                    <hr color="red" />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    v-if=" (editData[0].salePerson === 'person' && editData[0].saleBuyers === '2') ||  editData[0].salePerson === 'Legal' "
                    style="background-color: lightblue"
                  >
                    <span
                      v-if=" editData[0].salePerson === 'person' &&  editData[0].saleBuyers === '2' "
                      ><strong>2nd Purchaser</strong></span
                    >
                    <span v-else-if="editData[0].salePerson === 'Legal'"
                      ><strong>Trustee / Director</strong></span
                    >
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    style="background-color: lightblue"
                    v-if=" editData[0].salePerson === 'person' && editData[0].saleBuyers === '2' "
                  >
                    <v-radio-group
                      v-model="editData[0].personTwoMarital"
                      row
                      v-if=" editData[0].salePerson === 'person' && editData[0].saleBuyers === '2' "
                    >
                      <v-radio
                        label="Not married"
                        color="black"
                        value="Not married"
                      ></v-radio>
                      <v-radio
                        label="Married - ANC"
                        color="red darken-3"
                        value="Married - ANC"
                      ></v-radio>
                      <v-radio
                        label="Married - COP"
                        color="red darken-3"
                        value="Married - COP"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                    v-if="(editData[0].salePerson === 'person' && editData[0].saleBuyers === '2') || editData[0].salePerson === 'Legal'  "
                    style="background-color: lightblue"
                  >
                    <v-text-field
                      v-model="editData[0].personTwofirstName"
                      :label="this.twoPersonFirstNameLabel"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                    v-if=" (editData[0].salePerson === 'person' && editData[0].saleBuyers === '2') ||editData[0].salePerson === 'Legal' "
                    style="background-color: lightblue"
                  >
                    <v-text-field
                      v-model="editData[0].personTwoLastName"
                      :label="this.twoPersonLastNameLabel"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="6"
                    v-if="(editData[0].salePerson === 'person' &&  editData[0].saleBuyers === '2') || editData[0].salePerson === 'Legal' "
                    style="background-color: lightblue"
                  >
                    <v-text-field
                      v-model="editData[0].personTwoIDNumber"
                      label="ID Number*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="6"
                    v-if="
                      (editData[0].salePerson === 'person' &&
                        editData[0].saleBuyers === '2') ||
                        editData[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
                    <v-text-field
                      v-model="editData[0].personTwoEmail"
                      label="Email*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="6"
                    v-if="
                      (editData[0].salePerson === 'person' &&
                        editData[0].saleBuyers === '2') ||
                        editData[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
                    <span>Mobile - Required</span>
                    <VuePhoneNumberInput
                      id="phoneNumber1"
                      v-model="editData[0].personTwoMobile"
                      ref="mobile"
                      clearable
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                      @update="mobileStuff"
                    />
                  </v-col>
                  <v-col
                    cols="6"
                    v-if="
                      (editData[0].salePerson === 'person' &&
                        editData[0].saleBuyers === '2') ||
                        editData[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
                    <span>Landline</span>
                    <VuePhoneNumberInput
                      id="phoneNumber2"
                      v-model="editData[0].personTwoLandline"
                      ref="landline"
                      clearable
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                      @update="mobileStuff"
                    />
                  </v-col>
                  <v-col
                    cols="6"
                    v-if="
                      (editData[0].salePerson === 'person' &&
                        editData[0].saleBuyers === '2') ||
                        editData[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
                    <v-textarea
                      v-model="editData[0].personTwoPostalAddress"
                      label="Postal Address"
                      required
                      placeholder="Postal Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>
                  <v-col
                    cols="6"
                    v-if="
                      (editData[0].salePerson === 'person' &&
                        editData[0].saleBuyers === '2') ||
                        editData[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
                    <v-textarea
                      v-model="editData[0].personTwoResidentialAddress"
                      label="Residential Address"
                      required
                      placeholder="Residential Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>

                  <v-col cols="12">
                    <hr color="red" />
                  </v-col>

                  <!-- First row with the Bond/cash switch and the deposit amount and date  -->
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <v-radio-group v-model="editData[0].saleType" row>
                      <v-radio
                        label="Bonded"
                        color="black"
                        value="Bonded"
                      ></v-radio>
                      <v-radio
                        label="Cash"
                        color="green darken-3"
                        value="Cash"
                      ></v-radio>
                    </v-radio-group>
             
                  </v-col>
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Floorplan</b></strong>
                    <v-radio-group v-model="editData[0].floorplan" row>
                      <v-radio
                        v-for="plan in plans"
                        :key="plan"
                        :label="plan"
                        color="black"
                        :value="plan"
                        @click="changePriceIfEnclosed"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >

                    <v-file-input
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      label="Client signed plan"
                      v-model="planFile"
                      clearable
                      @change="showUploadBtn"
                    ></v-file-input>
                    <v-btn v-if="showUploadButton" @click="addPlans"
                      >Upload</v-btn
                    >
                    <a
                      :href="editData[0].url"
                      v-if="editData[0].planType"
                      target="_blank"
                      >View PlanType
                      <v-icon color="blue">mdi-attachment</v-icon>
                    </a>
                  </v-col>

                  <!-- end row 1 -->
                  <!-- Base Price -->
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Base Price</b></strong>
                    <v-text-field
                      v-model="basePriceStr"
                      label="Base Price"
                      readonly
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Deposit</b></strong>
                    <v-text-field
                      v-model="editData[0].deposit"
                      type="number"
                      min="0"
                      label="Deposit"
                      @input="setBalanceRemaining"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Deposit Date Paid</b></strong>
                    <v-text-field
                      v-model="this.depositDate"
                      type="text"
                      label="Deposit Date"
                    ></v-text-field>
                  </v-col>
                  <!-- end row -->

                  <!-- parking, extras, and contract_price-->

                  <v-col
                    cols="3"
                    sm="3"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <v-text-field
                      v-model="editData[0].parkingNumber"
                      type="number"
                      min="0"
                      max="4"
                      label="Extra Parking Bays"
                      required
                      @input="changePricing"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="2"
                    sm="2"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <v-text-field
                      v-model="parkingPriceStr"
                      label="Extra Parking Cost"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="4"
                    sm="2"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Stove Option:</b></strong>
                    <v-radio-group v-model="editData[0].gasStove">
                      <v-radio
                        name="active"
                        label="Glass"
                        color="black"
                        :value="0"
                        @click="changePriceIfGas"
                      ></v-radio>
                      <v-radio
                        name="active"
                        label="Gas"
                        color="orange darken-3"
                        :value="1"
                        @click="changePriceIfGas"
                      ></v-radio>
                      <v-radio
                        name="active"
                        label="Other"
                        color="orange darken-3"
                        :value="2"
                        @click="changePriceIfGas"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>

                  <v-col
                    cols="3"
                    sm="3"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <v-text-field
                      v-model="gasStoveStr"
                      label="Stove Cost"
                      readonly
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="3"
                    sm="2"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>KitchenOption:</b></strong>
                    <v-radio-group v-model="editData[0].kitchenOption">
                      <v-radio
                        name="active"
                        label="U-Shape"
                        color="black"
                        value="Ushape"
                      ></v-radio>
                      <v-radio
                        name="active"
                        label="L-Shape"
                        color="orange darken-3"
                        value="LShape"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>

                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <v-text-field
                      v-model="extrasStr"
                      label="Total Extras Cost"
                      readonly
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <label>
                      <b> Balance Remaining </b>
                    </label>

                    <v-text-field
                      v-model="balanceRemStr"
                      type="text"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <label><b> Contract Price </b> </label>
                    <v-text-field
                      v-model="contractPriceStr"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <!-- end row 3  -->
                  <v-col
                    cols="3"
                    sm="3"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Additional Extras Cost</b></strong>
                    <v-text-field
                      v-model="editData[0].additionalExtrasCost"
                      type="number"
                      min="0"
                      label="Cost"
                      @change="addAdditionalExtras"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="9"
                    sm="9"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Notes</b></strong>
                    <v-textarea
                      label="Notes"
                      rows="1"
                      v-model="editData[0].notes"
                    ></v-textarea>
                  </v-col>
                  <!-- row of addextras and notes -->

                  <!-- Standard Extras -->
                  <v-col
                    cols="3"
                    sm="3"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Garden Number:</b></strong>
                    <v-text-field
                      v-model="editData[0].gardenNumber"
                      type="text"
                      label="Garden Number"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="3"
                    sm="3"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Garden Size:</b></strong>
                    <v-text-field
                      v-model="editData[0].gardenSize"
                      type="number"
                      min="0"
                      max="4"
                      label="Garden Size"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="3"
                    sm="3"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Original Bay No:</b></strong>
                    <v-text-field
                      label="Original Bay Number"
                      v-model="editData[0].originalBayNo"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                    cols="3"
                    sm="3"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Parking Bay No:</b></strong>
                    <v-text-field
                      label="Bay Number"
                      v-model="editData[0].bayNo"
                    >
                    </v-text-field>
                  </v-col>
                  <!--  Gas stove-->

                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong
                      ><b
                        ><p style="font-size: 18px">
                          Beds: {{ editData[0].beds }}
                        </p>
                      </b></strong
                    >
                  </v-col>
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong
                      ><b>
                        <p style="font-size: 18px">
                          Bath: {{ editData[0].bath }}
                        </p>
                      </b></strong
                    >
                  </v-col>
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong
                      ><b>
                        <p style="font-size: 18px">
                          Enclosed Balcony: {{ editData[0].enclosedBalcony }}
                        </p>
                      </b></strong
                    >
                  </v-col>
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Spare Room:</b></strong>
                    <v-radio-group v-model="editData[0].spareRoom">
                      <v-radio
                        label="Bathroom"
                        color="black"
                        value="bathroom"
                      ></v-radio>
                      <v-radio
                        label="Study"
                        color="orange darken-3"
                        value="study"
                      >
                      </v-radio>
                    </v-radio-group>        
                  </v-col>

                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Mood</b></strong>
                    <v-radio-group v-model="editData[0].mood">
                      <v-radio
                        label="Allure"
                        color="black"
                        value="Allure"
                      ></v-radio>
                      <v-radio
                        label="Serene"
                        color="red darken-3"
                        value="Serene"
                      ></v-radio>
                    </v-radio-group>
                    <small>*indicates required field</small>
                  </v-col>
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Flooring</b></strong>
                    <v-radio-group v-model="editData[0].flooring">
                      <v-radio
                        label="Tiles"
                        color="black"
                        value="Tiles"
                      ></v-radio>
                      <v-radio
                        label="Laminate"
                        color="red darken-3"
                        value="Laminate"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col
                    cols="4"
                    sm="4"
                    style="background-color: lightgoldenrodyellow"
                  >
                    <strong><b>Actual Sales Date</b></strong>
                    <v-text-field
                      v-model="editData[0].actualSalesdate"
                      
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="8"
                    sm="8"
                    style="background-color: lightgoldenrodyellow"
                  >
                  </v-col>

                  <!-- End of financial section -->

                  <v-col cols="12">
                    <hr color="red" />
                  </v-col>
                  <label v-if="editData[0].salePerson === 'person'">
                    <pre> File Uploads  </pre>
                  </label>

                  <label v-if="editData[0].salePerson === 'Legal'">
                    Trust / Company Uploads
                  </label>


                  <v-col
                    cols="12"
                    sm="12"
                    v-if="!editData[0].fileOTP.length ||  editData[0].fileOTP === 'undefined' "
                  >
                    <v-file-input
                      v-model="fileOTP"
                      label="OTP"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      filled
                      hint="OTP"
                      persistent-hint
                    ></v-file-input>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="12"
                    v-if=" !editData[0].fileId.length || editData[0].fileId === 'undefined' "
                  >
                    <v-file-input
                      v-model="fileId"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      label="Upload ID/Passport Photo"
                      filled
                      hint="Upload ID/Passport Photo"
                      persistent-hint
                    ></v-file-input>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="12"
                    v-if=" !editData[0].fileFica.length || editData[0].fileFica === 'undefined'"
                  >
                    <v-file-input
                      v-model="fileFica"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      label="Proof of address documentation"
                      filled
                      multiple
                      hint="Proof of address documentation"
                      persistent-hint
                    ></v-file-input>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="12"
                    v-if="!editData[0].fileDepositPop.length || editData[0].fileDepositPop === 'undefined' "
                  >
                    <v-file-input
                      v-model="fileDepositPop"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      label="Upload Deposit POP"
                      filled
                      multiple
                      hint="Upload Deposit POP"
                      persistent-hint
                    ></v-file-input>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="12"
                    v-if=" !editData[0].fileBank.length || editData[0].fileBank === 'undefined' "
                  >
                    <v-file-input
                      v-if="editData[0].salePerson !== 'Legal'"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      v-model="fileBank"
                      label="Upload Bank Statements"
                      filled
                      hint="Upload Bank Statements"
                      persistent-hint
                    ></v-file-input>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="12"
                    v-if=" !editData[0].filePaySlip.length || editData[0].filePaySlip === 'undefined'"
                  >
                    <v-file-input
                      v-if="editData[0].salePerson !== 'Legal'"
                      v-model="filePaySlip"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      label="Upload latest 3 months payslips"
                      filled
                      multiple
                      hint="Upload latest 3 months payslips"
                      persistent-hint
                    ></v-file-input>
                  </v-col> 



                  <v-col cols="12">
                    <hr color="red" />
                  </v-col>
                  <label
                    v-if="editData[0].salePerson === 'person' && editData[0].saleBuyers === '2'"
                  >
                    Person 2 File Uploads
                  </label>

                  <label v-if="editData[0].salePerson === 'Legal'">
                    Trustee Uploads
                  </label>
               

                  <v-col
                    cols="12"
                    sm="12"
                    v-if=" !editData[0].personTwoFileID.length || editData[0].personTwoFileID === 'undefined' "
                  >
                    <v-file-input
                      v-model="personTwoFileID"
                      label="Upload ID/Passport Photo"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      filled
                      hint="Upload ID/Passport Photo"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    v-if="!editData[0].personTwoFileFica.length || editData[0].personTwoFileFica === 'undefined'"
                  >
                    <v-file-input
                      v-model="personTwoFileFica"
                      label="Proof of address documentation"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      filled
                      multiple
                      hint="Proof of address documentation"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    v-if="!editData[0].personTwoFileBank.length || editData[0].personTwoFileBank === 'undefined'"
                  >
                    <v-file-input
                      v-model="personTwoFileBank"
                      label="Upload Bank Statements"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      filled
                      hint="Upload Bank Statements"
                      persistent-hint
                    ></v-file-input>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    v-if="!editData[0].personTwoFilePaySlip.length || editData[0].personTwoFilePaySlip === 'undefined'"
                  >
                    <v-file-input
                      v-model="personTwoFilePaySlip"
                      label="Upload latest 3 months payslips"
                      accept="image/png, image/jpeg, image/bmp, image/jpg, application/pdf"
                      filled
                      multiple
                      hint="Upload latest 3 months payslips"
                      persistent-hint
                    ></v-file-input>
                  </v-col> 

                  <v-col cols="6" style="background-color: lightsalmon">
                    <v-text-field
                      v-model="editData[0].salesAgent"
                      label="Sales Agent"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" style="background-color: lightsalmon">
                    <span>Mobile</span>
                    <VuePhoneNumberInput
                      id="phoneNumber3"
                      v-model="editData[0].salesAgentPhone"
                      ref="mobile"
                      clearable
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                    />
                  </v-col>
                </v-row>
              </v-container>           
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeClientInfo" color="primary" elevation="3"  outlined rounded>
                Close
              </v-btn>

              <v-btn text  @click="submitClientData" color="primary" elevation="3"  outlined rounded>
                Save
                <v-icon dark right>
                  mdi-checkbox-marked-circle
                </v-icon>
              </v-btn>              
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-snackbar top v-model="snackbar">
        {{ snackBarmessage }}
        <v-btn color="red" text @click="snackbar = false"> Close </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import * as dayjs from "dayjs";
import VuePhoneNumberInput from "vue-phone-number-input";
let url = process.env.VUE_APP_BASEURL;
import "vue-phone-number-input/dist/vue-phone-number-input.css";

export default {
  name: "clientupsert",

  components: {
    VuePhoneNumberInput
  },

  props: {
    dialog: Boolean,
    upsertMode: String,
    editData: Array,
    unitId: Number,    
  },

  data() {
    return {
      snackbar: false,
      snackBarmessage: "Successfully Updated!!",

      fileOTP: null,
      fileId: null,
      fileBank: null,
      filePaySlip: null,
      fileFica: null,
      fileDepositPop: null,
      planFile: null,
      showUploadButton: false,

      personTwoFileID: null,
      personTwoFileBank: null,
      personTwoFilePaySlip: null,
      personTwoFileFica: null,

      firstNameLabel: "First Name*",
      lastNameLabel: "Last Name*",
      twoPersonFirstNameLabel: "2nd Person First Name",
      twoPersonLastNameLabel: "2nd Person Last Name",

      plans: [],
      floorPlans: [],
      floorplancost: 0,

      bayNo: "",
      spareRoom: "",

      BondAmountRequired: "Bond Amount Required",
      BalanceRemaining: "Balance Remaining",

      additionalExtras: "",
      additionalExtrasCost: 0,
      enclosedBalcony: 0,

      gasStove: 0,
      gasStoveCost: 0,
      gasStoveStr: "",
      cashDeal: false,

      gardenSize: "",
      gardenNumber: "",
      beds: "",
      bath: "",
      balanceRem: "",
      balanceRemStr: "",
      deposit: "",
      depositStr: "",
      depositDate: "",

      Balance: "",

      saleType: "",

      contractPrice: 0,
      contractPriceStr: "",
      basePrice: 0,
      basePriceStr: "",
      parkingNumber: 0,
      parking: 0,
      parkingPrice: 25000,
      parkingPriceStr: "",
      extras: 0,
      extrasStr: "",
      deductions: 0,
      deductionsStr: "",
      mobile: {
        countryCode: "ZA",
        isValid: false,
        phoneNumber: ""
      },
      landline: {
        countryCode: "ZA",
        isValid: false,
        phoneNumber: ""
      }
    };
  },

  mounted() {
    if (this.upsertMode === "Add") {
         console.log("upsertMode", this.upsertMode)
          this.editData[0].saleBuyers                      = null,
          this.editData[0].trustName                       = null,
          this.editData[0].trustNumber                     = null,
          this.editData[0].marital                         = null,
          this.editData[0].firstname                       = null,
          this.editData[0].lastname                        = null,
          this.editData[0].iDNumber                        = null,
          this.editData[0].email                           = null,
          this.editData[0].mobile                          = null,
          this.editData[0].landline                        = null,
          this.editData[0].postalAddress                   = null,
          this.editData[0].residentialAddress              = null,
          this.editData[0].personTwoMarital                = null,
          this.editData[0].personTwofirstName              = null,
          this.editData[0].personTwoLastName               = null,
          this.editData[0].personTwoIDNumber               = null,
          this.editData[0].personTwoEmail                  = null,
          this.editData[0].personTwoMobile                 = null,
          this.editData[0].personTwoLandline               = null,
          this.editData[0].personTwoPostalAddress          = null,
          this.editData[0].personTwoResidentialAddress     = null,
          this.editData[0].saleType                        = null,
          this.editData[0].floorplan                       = null,
          this.editData[0].url                             = null,
          this.editData[0].planType                        = null,
          this.editData[0].deposit                         = null,
          this.editData[0].parkingNumber                   = null,
          this.editData[0].gasStove                        = null,
          this.editData[0].kitchenOption                   = null,
          this.editData[0].additionalExtrasCost            = null,
          this.editData[0].notes                           = null,
          this.editData[0].gardenNumber                    = null,
          this.editData[0].gardenSize                      = null,
          this.editData[0].originalBayNo                   = null,
          this.editData[0].bayNo                           = null,
          this.editData[0].beds                            = null,
          this.editData[0].bath                            = null,
          this.editData[0].enclosedBalcony                 = null,
          this.editData[0].spareRoom                       = null,
          this.editData[0].mood                            = null,
          this.editData[0].flooring                        = null,
          this.editData[0].actualSalesdate                 = null,
                                  
          this.editData[0].fileOTP                         = "",
          this.editData[0].fileId                          = "",
          this.editData[0].fileFica                        = "",
          this.editData[0].fileDepositPop                  = "",
          this.editData[0].fileBank                        = "",
          this.editData[0].filePaySlip                     = "",
          this.editData[0].personTwoFileID                 = "",
          this.editData[0].personTwoFileFica               = "",
          this.editData[0].personTwoFileBank               = "",
          this.editData[0].personTwoFilePaySlip            = "",

          this.editData[0].salesAgent  					           = null,
          this.editData[0].salesAgentPhone				         = null
         console.log("editData[0]=", this.editData[0])

    console.log("ClientUpsert - in mounted() - upsertMode = ", this.upsertMode)

    } else  // fill in the forms Data from existing sale
    {
      console.log("Mode", this.upsertMode)
      this.editData.forEach(el => {
        el.saleBuyers = parseInt(el.saleBuyers);
        el.gasStove = parseInt(el.gasStove);
        el.id = el.id.toString();
        if (el.flooring === "") {
          el.flooring = "Tiles";
        }
        if (el.mood === "") {
          el.mood = "Mood1";
        }
      });

      this.editData[0].url = `${process.env.VUE_APP_BASEURL}/${this.editData[0].planType}`;

      this.plans = this.editData[0].unit_type.split(",");
      this.parkingPriceStr = this.convertToString(
        parseFloat(this.editData[0].parking)
      );

      if (parseFloat(this.editData[0].parking) > 0) {
        this.editData[0].parkingNumber =
          parseFloat(this.editData[0].parking) / this.parkingPrice;
      }
      this.extrasStr = this.convertToString(parseFloat(this.editData[0].extras));
      this.contractPrice = parseFloat(this.editData[0].contract_price);
      this.contractPriceStr = this.convertToString(
        parseFloat(this.contractPrice)
      );
      if (parseInt(this.editData[0].gasStove) === 1) {
        this.gasStoveCost = 2000;
      } else {
        this.gasStoveCost = 0;
      }
      this.gasStoveStr = this.convertToString(this.gasStoveCost);
      this.finaliseCosts();

      this.balanceRemStr = this.convertToString(this.editData[0].balanceRem);
      this.depositStr = this.convertToString(this.editData[0].deposit);
      this.basePriceStr = this.convertToString(this.editData[0].base_price);
      this.depositDate = this.editData[0].depositDate.split(" ")[0];
      if (this.editData[0].actualSalesdate !== null) {
        this.editData[0].actualSalesdate = dayjs(
          this.editData[0].actualSalesdate
        ).format("YYYY-MM-DD");
      }
    }
  },

  methods: {
    closeClientInfo() {
      this.$emit("closeForm", false);
    },
    showUploadBtn() {
      if (this.planFile !== null) {
        this.showUploadButton = true;
      } else {
        this.showUploadButton = false;
      }
    },
    async addPlans() {
      let formData = new FormData();

      formData.append("plans", this.planFile);
      formData.append("id", this.editData[0].id);
      formData.append(
        "client",
        `${this.editData[0].unit}-${this.editData[0].firstname}${this.editData[0].lastname}`
      );

      await axios({
        method: "post",
        url: `${url}/uploadPlansWB`,
        data: formData
      }).then(
        response => {
          console.log(response.data);
          this.showUploadButton = false;
          this.updateClientData();
          this.snackbar = true;
          // close the form after completing
          // this.closeClientInfo();
        },
        error => {
          console.log(error);
        }
      );
    },
    convertToString(factor) {
      //CONVERTS NUMBERS TO STRING WTH "R"
      if (typeof factor === "string" || factor instanceof String) {
        factor = parseFloat(factor);
      }
      let str = factor
        .toFixed(2)
        .toString()
        .split("")
        .reverse();
        if (str.length < 1) { console.log("") } else {
      if (str.length > 9) {
        str.splice(9, 0, " ");
      }
      if (str.length > 6) {
        str.splice(6, 0, " ");
      }
      str.reverse().unshift("R");
      str = str.join("");
        }
      return str;
    },
    setBalanceRemaining() {
      this.balanceRem =
        parseFloat(this.contractPrice) - parseFloat(this.editData[0].deposit);
      this.balanceRemStr = this.convertToString(this.balanceRem);
    },
    addAdditionalExtras() {
      console.log(this.editData[0].additionalExtrasCost);
      this.finaliseCosts();
    },

    changePriceIfEnclosed() {
      let chosenFloorplan = this.editData[0].floorPlans.filter(el => {
        return this.floorplan === el.plan;
      });

      this.floorplancost = chosenFloorplan[0].enclosedValue;
      this.enclosedBalcony = chosenFloorplan[0].enclosedBalcony;
      this.finaliseCosts();
    },
    changePriceIfGas() {
      if (parseInt(this.editData[0].gasStove) === 1) {
        this.gasStoveCost = 2000;
      } else {
        this.gasStoveCost = 0;
      }
      this.gasStoveStr = this.convertToString(this.gasStoveCost);

      this.finaliseCosts();
    },
    finaliseCosts() {
      this.editData[0].extras =
        parseFloat(this.floorplancost) +
        parseFloat(this.gasStoveCost) +
        parseFloat(this.editData[0].parking);

      this.extrasStr = this.convertToString(this.editData[0].extras);
      this.contractPrice =
        parseFloat(this.editData[0].base_price) +
 
        parseFloat(this.editData[0].extras) +
        parseFloat(this.editData[0].additionalExtrasCost) -
        parseFloat(this.editData[0].deductions);

      this.contractPriceStr = this.convertToString(this.contractPrice);
    },
    changePricing() {
      this.editData[0].parking =
        parseFloat(this.editData[0].parkingNumber) *
        parseFloat(this.parkingPrice);

      this.editData[0].deductionsStr = this.convertToString(this.deductions);

      this.parkingPriceStr = this.convertToString(
        parseFloat(this.editData[0].parkingNumber) *
          parseFloat(this.parkingPrice)
      );

      this.finaliseCosts();
    },
    naturalTrust() {
      if (this.editData[0].salePerson === "Legal") {
        this.firstNameLabel = "Director / Trustee First Name*";
        this.twoPersonFirstNameLabel = "2nd Director / Trustee First Name*";
        this.lastNameLabel = "Director / Trustee Last Name*";
        this.twoPersonLastNameLabel = "2nd Director / Trustee Last Name*";
      } else {
        this.firstNameLabel = "First Name*";
        this.lastNameLabel = "Last Name*";
      }
    },
    mobileStuff(event) {

      console.log("landline", event);
      console.log("mobile", event);
    },
    submitClientData() {
      if (this.upsertMode === "Add") {
        this.insertClientData()
      } else {
        this.updateClientData()
      }
    },
    async updateClientData() {
      // get the form fields data to pass to salesRoutes /updateClient
      let files = [];
      let contains = [];
      if (this.fileOTP !== null) {
        contains.push("fileOTP");
        files.push(this.fileOTP); // append mimetype here?
      }
      if (this.fileId !== null) {
        contains.push("fileId");
        files.push(this.fileId);
      }
      if (this.personTwoFileID !== null) {
        contains.push("personTwoFileID");
        files.push(this.personTwoFileID);
      }

      if (this.fileBank !== null) {
        contains.push("fileBank");
        files.push(this.fileBank);
      }
      if (this.personTwoFileBank !== null) {
        contains.push("personTwoFileBank");
        files.push(this.personTwoFileBank);
      }

      if (this.fileDepositPop !== null) {
        contains.push("fileDepositPop");
        files.push(this.fileDepositPop);
      }

      if (this.filePaySlip) {
        this.filePaySlip.forEach(el => {
          contains.push("filePaySlip");
          files.push(el);
        });
      } else {
        console.log("No File");
      }
      if (this.personTwoFilePayslip) {
        this.personTwoFilePayslip.forEach(el => {
          contains.push("personTwoFilePaySlip");
          files.push(el);
        });
      } else {
        console.log("No File");
      }

      if (this.fileFica) {
        this.fileFica.forEach(el => {
          contains.push("fileFica");
          files.push(el);
        });
      } else {
        console.log("No File");
      }
      if (this.personTwoFileFica) {
        this.personTwoFileFica.forEach(el => {
          contains.push("personTwoFileFica");
          files.push(el);
        });
      } else {
        console.log("No File");
      }

      let formData = new FormData();

      for (var x = 0; x < files.length; x++) {
        formData.append("documents", files[x]);
      }

      formData.append("trustName", this.editData[0].trustName);
      formData.append("trustNumber", this.editData[0].trustNumber);
      formData.append("firstName", this.editData[0].firstname);
      formData.append("lastName", this.editData[0].lastname);
      formData.append("iDNumber", this.editData[0].iDNumber);
      formData.append("marital", this.marital);
      formData.append("email", this.editData[0].email);
      formData.append("bankName", this.editData[0].bankName);
      formData.append("accountNumber", this.editData[0].accountNumber);
      formData.append("accountType", this.editData[0].accountType);
      formData.append("block", this.editData[0].block);
      formData.append("unit", this.editData[0].unit);
      formData.append("mood", this.editData[0].mood);
      formData.append("flooring", this.editData[0].flooring);
      formData.append("floorplan", this.editData[0].floorplan);
      formData.append("mobile", this.editData[0].mobile);
      formData.append("landline", this.editData[0].landline);
      formData.append("postalAddress", this.editData[0].postalAddress);
      formData.append( "residentialAddress",  this.editData[0].residentialAddress );
      formData.append("contract_price", this.editData[0].contract_price);
      formData.append("personTwoFirstName", this.editData[0].personTwoFirstName);
      formData.append("personTwoLastName", this.editData[0].personTwoLastName);
      formData.append("personTwoIDNumber", this.editData[0].personTwoIDNumber);
      formData.append("personTwoMarital", this.editData[0].personTwoMarital);
      formData.append("personTwoEmail", this.editData[0].personTwoEmail);
      formData.append("personTwoBankName", this.editData[0].personTwoBankName);
      formData.append( "personTwoAccountNumber", this.editData[0].personTwoAccountNumber );
      formData.append("personTwoAccountType", this.editData[0].personTwoAccountType );
      formData.append("personTwoMobile", this.editData[0].personTwoMobile);
      formData.append("personTwoLandline", this.editData[0].personTwoLandline);
      formData.append( "personTwoPostalAddress", this.editData[0].personTwoPostalAddress );
      formData.append( "personTwoResidentialAddress", this.editData[0].personTwoResidentialAddress);
      formData.append("base_price", this.editData[0].base_price);
      formData.append("parking", this.editData[0].parking);
      formData.append("originalBayNo", this.editData[0].originalBayNo);
      formData.append("extras", this.editData[0].extras);
      formData.append("deductions", this.editData[0].deductions);
      formData.append("salesAgent", this.editData[0].salesAgent);
      formData.append("salesAgentPhone", this.editData[0].salesAgentPhone);
      formData.append("contains", contains);
      formData.append("id", this.editData[0].id);
      formData.append("notes", this.editData[0].notes);
      formData.append("cashDeal", this.editData[0].cashDeal);
      formData.append("balanceRem", this.editData[0].balanceRem);
      formData.append("deposit", this.editData[0].deposit);
      formData.append("depositDate", this.depositDate);
      formData.append("gasStove", this.editData[0].gasStove);
      formData.append("additionalExtras", this.editData[0].additionalExtras);
      formData.append( "additionalExtrasCost", this.editData[0].additionalExtrasCost );
      formData.append("spareRoom", this.editData[0].spareRoom);
      formData.append("enclosedBalcony", this.editData[0].enclosedBalcony);
      formData.append("saleType", this.editData[0].saleType);
      formData.append("salePerson", this.editData[0].salePerson);
      formData.append("saleBuyers", this.editData[0].saleBuyers);
      formData.append("development", this.$store.state.development.id);
      console.log("FormData before sending to server", this.formData)
      await axios({
        method: "post",
        url: `${url}/updateClientCM`,
        data: formData
      }).then(
        response => {
          console.log(response.data);

          this.snackbar = true;

          this.closeClientInfo();
        },

        error => {
          console.log(error);
        }
      );
    },
    async insertClientData() {
      // console.log(this.firstName);
      let files = [];
      let contains = [];
      if (this.fileOTP !== null) {
        contains.push("fileOTP");
        files.push(this.fileOTP); // append mimetype here?
      }
      if (this.fileId !== null) {
        contains.push("fileId");
        files.push(this.fileId);
      }
      if (this.personTwoFileID !== null) {
        contains.push("personTwoFileID");
        files.push(this.personTwoFileID);
      }

      if (this.fileBank !== null) {
        contains.push("fileBank");
        files.push(this.fileBank);
      }
      if (this.personTwoFileBank !== null) {
        contains.push("personTwoFileBank");
        files.push(this.personTwoFileBank);
      }

      if (this.filePaySlip) {
        this.filePaySlip.forEach(el => {
          contains.push("filePaySlip");
          files.push(el);
        });
      } else {
        console.log("No File");
      }
      if (this.personTwoFilePayslip) {
        this.personTwoFilePayslip.forEach(el => {
          contains.push("personTwoFilePayslip");
          files.push(el);
        });
      } else {
        console.log("No File");
      }

      if (this.fileFica) {
        this.fileFica.forEach(el => {
          contains.push("fileFica");
          files.push(el);
        });
      } else {
        console.log("No File");
      }
      if (this.personTwoFileFica) {
        this.personTwoFileFica.forEach(el => {
          contains.push("personTwoFileFica");
          files.push(el);
        });
      } else {
        console.log("No File");
      }

      if (this.fileDepositPop !== null) {
        contains.push("fileDepositPop");
        files.push(this.fileDepositPop);
      }

      let formData = new FormData();
      for (var x = 0; x < files.length; x++) {
        formData.append("documents", files[x]);
      }
            console.log("FormData before sending to server1 ", this.formData)
      formData.append("firstName", this.firstName);
      formData.append("lastName", this.lastName);
      formData.append("iDNumber", this.iDNumber);
      formData.append("marital", this.marital);
      formData.append("email", this.email);
      formData.append("bankName", this.bankName);
      formData.append("accountNumber", this.accountNumber);
      formData.append("accountType", this.accountType);
      formData.append("block", this.blockValue);
      formData.append("unit", this.unitValue);
      formData.append("mood", this.mood);
      formData.append("flooring", this.flooring);
      formData.append("floorplan", this.floorplan);
      formData.append("mobile", this.mobile.phoneNumber);
      formData.append("landline", this.landline.phoneNumber);
      formData.append("postalAddress", this.postaladdress);
      formData.append("residentialAddress", this.residentialAddress);
      formData.append("trustName", this.trustName);
      formData.append("trustNumber", this.trustNumber);
      formData.append("personTwoFirstName", this.personTwoFirstName);
      formData.append("personTwoLastName", this.personTwoLastName);
      formData.append("personTwoIDNumber", this.personTwoIDNumber);
      formData.append("personTwoMarital", this.personTwoMarital);
      formData.append("personTwoEmail", this.personTwoEmail);
      formData.append("personTwoBankName", this.personTwoBankName);
      formData.append("personTwoAccountNumber", this.personTwoAccountNumber);
      formData.append("personTwoAccountType", this.personTwoAccountType);
      formData.append("personTwoMobile", this.personTwoMobile);
      formData.append("personTwoLandline", this.personTwoLandline);
      formData.append("personTwoPostalAddress", this.personTwoPostalAddress);
      formData.append("personTwoResidentialAddress", this.personTwoResidentialAddress );
      formData.append("salePerson", this.person);
      formData.append("saleBuyers", this.buyers);
      formData.append("saleType", this.saleType);
      formData.append("salesAgent", this.salesAgent);
      formData.append("salesAgentPhone", this.salesAgentPhone);
      formData.append("contains", contains);
      formData.append("contract_price", this.contractPrice);
      formData.append("base_price", this.basePrice);
      formData.append("parking", this.parking);
      formData.append("originalBayNo", this.originalBayNo);
      formData.append("extras", this.extras);
      formData.append("deductions", this.deductions);
      formData.append("notes", this.notes);
      formData.append("cashDeal", this.cashDeal);
      formData.append("balanceRem", this.balanceRem);
      formData.append("deposit", this.deposit);
      formData.append("depositDate", this.depositDate);
      formData.append("gasStove", this.gasStove);
      formData.append("gasStoveCost", this.gasStoveCost);
      formData.append("spareRoom", this.spareRoom);
      formData.append("additionalExtras", this.additionalExtras);
      formData.append("additionalExtrasCost", this.additionalExtrasCost);
      formData.append("bayNo", this.bayNo);
      formData.append("enclosedBalcony", this.enclosedBalcony);
      formData.append("development", this.$store.state.development.id);
      console.log("FormData before sending to server", this.formData)
      await axios({
        method: "post",
        url: `${url}/createClientCM`,
        data: formData
      }).then(
        response => {
          console.log(response.data);
          this.snackbar = true;
        },
        error => {
          console.log(error);
        }
      );
    }
  }
};
</script>
