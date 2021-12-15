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
                      v-model="dataToPost[0].salePerson"
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
                      v-if="dataToPost[0].salePerson === 'person'"
                      v-model="buyers"
                      :change="changeBuyers"
                    >
                      <v-radio
                        name="active"
                        label="1 Person"
                        value="1"
                      ></v-radio>
                      <v-radio
                        name="active"
                        label="2 People"
                        value="2"
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
                    v-if="dataToPost[0].salePerson === 'Legal'"
                    style="background-color: lightgrey"
                  >
                    <v-text-field
                      v-model="dataToPost[0].trustName"
                      label="Trust / Company name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    v-if="dataToPost[0].salePerson === 'Legal'"
                    style="background-color: lightgrey"
                  >
                    <v-text-field
                      v-model="dataToPost[0].trustNumber"
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
                      v-model="dataToPost[0].marital"
                      row
                      v-if="dataToPost[0].salePerson === 'person'"
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
                      v-model="dataToPost[0].firstname"
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
                      v-model="dataToPost[0].lastname"
                      :label="lastNameLabel"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" style="background-color: lightgrey">
                    <v-text-field
                      v-model="dataToPost[0].iDNumber"
                      label="ID Number*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" style="background-color: lightgrey">
                    <v-text-field
                      v-model="dataToPost[0].email"
                      label="Email*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" style="background-color: lightgrey">
                    <span>Mobile - Required</span>
                    <VuePhoneNumberInput
                      id="phoneNumber1"
                      v-model="mobile.phoneNumber1"
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
                      v-model="landline.phoneNumber2"
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
                      v-model="dataToPost[0].postalAddress"
                      label="Postal Address"
                      required
                      placeholder="Postal Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="6" style="background-color: lightgrey">
                    <v-textarea
                      v-model="dataToPost[0].residentialAddress"
                      label="Residential Address"
                      required
                      placeholder="Residential Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>

                  <!-- </div> -->
                  <v-col
                    cols="12"
                    v-if=" (dataToPost[0].salePerson === 'person' && buyers === '2') || dataToPost[0].salePerson === 'Legal'  "
                  >
                    <hr color="red" />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    v-if=" (dataToPost[0].salePerson === 'person' && buyers === '2') ||  dataToPost[0].salePerson === 'Legal' "
                    style="background-color: lightblue"
                  >
                    <span
                      v-if=" dataToPost[0].salePerson === 'person' &&  buyers === '2' "
                      ><strong>2nd Purchaser</strong></span
                    >
                    <span v-else-if="dataToPost[0].salePerson === 'Legal'"
                      ><strong>Trustee / Director</strong></span
                    >
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    style="background-color: lightblue"
                    v-if=" dataToPost[0].salePerson === 'person' && buyers === '2' "
                  >
                    <v-radio-group
                      v-model="dataToPost[0].personTwoMarital"
                      row
                      v-if=" dataToPost[0].salePerson === 'person' && buyers === '2' "
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
                    v-if="(dataToPost[0].salePerson === 'person' && buyers === '2') || dataToPost[0].salePerson === 'Legal'  "
                    style="background-color: lightblue"
                  >
                    <v-text-field
                      v-model="dataToPost[0].personTwofirstName"
                      :label="this.twoPersonFirstNameLabel"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                    v-if=" (dataToPost[0].salePerson === 'person' && buyers === '2') ||dataToPost[0].salePerson === 'Legal' "
                    style="background-color: lightblue"
                  >
                    <v-text-field
                      v-model="dataToPost[0].personTwoLastName"
                      :label="this.twoPersonLastNameLabel"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="6"
                    v-if="(dataToPost[0].salePerson === 'person' &&  buyers === '2') || dataToPost[0].salePerson === 'Legal' "
                    style="background-color: lightblue"
                  >
                    <v-text-field
                      v-model="dataToPost[0].personTwoIDNumber"
                      label="ID Number*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="6"
                    v-if="
                      (dataToPost[0].salePerson === 'person' &&
                        buyers === '2') ||
                        dataToPost[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
                    <v-text-field
                      v-model="dataToPost[0].personTwoEmail"
                      label="Email*"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="6"
                    v-if="
                      (dataToPost[0].salePerson === 'person' &&
                        buyers === '2') ||
                        dataToPost[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
   
                <span>Contact One - Mobile - Required</span>
          
                    <span>Mobile - Required</span>
                    <VuePhoneNumberInput
                      id="phoneNumber3"
                      v-model="mobile.phoneNumber3"
                      ref="mobile"
                      clearable
                      default-country-code="ZA"
                      show-code-on-list
                      :only-countries="['ZA']"
                     
                    />
                  </v-col>
                  <v-col
                    cols="6"
                    v-if="
                      (dataToPost[0].salePerson === 'person' &&
                        buyers === '2') ||
                        dataToPost[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
                    <span>Landline</span>
                    <VuePhoneNumberInput
                      id="phoneNumber2"
                      v-model="landline.phoneNumber4"
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
                      (dataToPost[0].salePerson === 'person' &&
                        buyers === '2') ||
                        dataToPost[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
                    <v-textarea
                      v-model="dataToPost[0].personTwoPostalAddress"
                      label="Postal Address"
                      required
                      placeholder="Postal Address"
                      rows="4"
                    ></v-textarea>
                  </v-col>
                  <v-col
                    cols="6"
                    v-if="
                      (dataToPost[0].salePerson === 'person' &&
                        buyers === '2') ||
                        dataToPost[0].salePerson === 'Legal'
                    "
                    style="background-color: lightblue"
                  >
                    <v-textarea
                      v-model="dataToPost[0].personTwoResidentialAddress"
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
                    <v-radio-group v-model="dataToPost[0].saleType" row>
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
                    <v-radio-group v-model="dataToPost[0].floorplan" row>
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
                      :href="dataToPost[0].url"
                      v-if="dataToPost[0].planType"
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
                      v-model="dataToPost[0].deposit"
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
                      v-model="dataToPost[0].parkingNumber"
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
                    <v-radio-group v-model="dataToPost[0].gasStove">
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
                    <v-radio-group v-model="dataToPost[0].kitchenOption">
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
                      v-model="dataToPost[0].additionalExtrasCost"
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
                      v-model="dataToPost[0].notes"
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
                      v-model="dataToPost[0].gardenNumber"
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
                      v-model="dataToPost[0].gardenSize"
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
                      v-model="dataToPost[0].originalBayNo"
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
                      v-model="dataToPost[0].bayNo"
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
                          Beds: {{ dataToPost[0].beds }}
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
                          Bath: {{ dataToPost[0].bath }}
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
                          Enclosed Balcony: {{ dataToPost[0].enclosedBalcony }}
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
                    <v-radio-group v-model="dataToPost[0].spareRoom">
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
                    <v-radio-group v-model="dataToPost[0].mood">
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
                    <v-radio-group v-model="dataToPost[0].flooring">
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
                      v-model="dataToPost[0].actualSalesdate"
                      
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
                  <label v-if="dataToPost[0].salePerson === 'person'">
                    <pre> File Uploads  </pre>
                  </label>

                  <label v-if="dataToPost[0].salePerson === 'Legal'">
                    Trust / Company Uploads
                  </label>


                  <v-col
                    cols="12"
                    sm="12"
                    v-if="!dataToPost[0].fileOTP.length ||  dataToPost[0].fileOTP === 'undefined' "
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
                    v-if=" !dataToPost[0].fileId.length || dataToPost[0].fileId === 'undefined' "
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
                    v-if=" !dataToPost[0].fileFica.length || dataToPost[0].fileFica === 'undefined'"
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
                    v-if="!dataToPost[0].fileDepositPop.length || dataToPost[0].fileDepositPop === 'undefined' "
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
                    v-if=" !dataToPost[0].fileBank.length || dataToPost[0].fileBank === 'undefined' "
                  >
                    <v-file-input
                      v-if="dataToPost[0].salePerson !== 'Legal'"
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
                    v-if=" !dataToPost[0].filePaySlip.length || dataToPost[0].filePaySlip === 'undefined'"
                  >
                    <v-file-input
                      v-if="dataToPost[0].salePerson !== 'Legal'"
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
                    v-if="dataToPost[0].salePerson === 'person' && buyers === '2'"
                  >
                    Person 2 File Uploads
                  </label>

                  <label v-if="dataToPost[0].salePerson === 'Legal'">
                    Trustee Uploads
                  </label>
               

                  <v-col
                    cols="12"
                    sm="12"
                    v-if="(buyers === '2' || dataToPost[0].salePerson === 'Legal')"
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
                    v-if="(buyers === '2' || dataToPost[0].salePerson === 'Legal')"
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
                    v-if="(buyers === '2' || dataToPost[0].salePerson === 'Legal')"
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
                    v-if="(buyers === '2' || dataToPost[0].salePerson === 'Legal')"
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
                      v-model="dataToPost[0].salesAgent"
                      label="Sales Agent"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" style="background-color: lightsalmon">
                    <span>Mobile</span>
                    <VuePhoneNumberInput
                      id="phoneNumber5"
                      v-model="mobile.phoneNumber5"
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
    unitValue: String,
    planType: String,
    editData: Array,
    unitId: Number,    
  },

  data() {
    return {
      dataToPost: [],

      buyers: 1,
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
        phoneNumber1: "",
        phoneNumber3: "",
        phoneNumber5: "",
        
      },
      landline: {
        countryCode: "ZA",
        isValid: false,
        phoneNumber2: "",
        phoneNumber4: ""
      }
    };
  },

  beforeMount() {
    console.log("ClientUpsert.Vue - beforeMount() : upsertMode = ", this.upsertMode)
    console.log("ClientUpsert.Vue - beforeMount() : unitValue = ", this.unitValue) 
    console.log("ClientUpsert.Vue - beforeMount() : saleBuyers = ", this.buyers) 
    console.log("ClientUpsert.Vue - beforeMount() : planType = ", this.planType) 


      console.log("CONNOR : this.editData =", this.editData)
      
      this.dataToPost = JSON.parse(JSON.stringify(this.editData))
     // this.dataToPost[0].id = 0

      console.log("CONNOR WINNING: dataToPost =", this.dataToPost)

      this.dataToPost.forEach(el => {
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

      this.dataToPost[0].url = `${process.env.VUE_APP_BASEURL}/${this.dataToPost[0].planType}`;

      this.plans = this.unitValue.split(",");
      this.parkingPriceStr = this.convertToString(
        parseFloat(this.dataToPost[0].parking)
      );

      if (parseFloat(this.dataToPost[0].parking) > 0) {
        this.dataToPost[0].parkingNumber =
          parseFloat(this.dataToPost[0].parking) / this.parkingPrice;
      }

      // debug 1212 // debug 1212 // debug 1212 // debug 1212 // debug 1212
      this.extrasStr = this.convertToString(parseFloat(this.dataToPost[0].extras));
      // debug 1212
      this.contractPrice = parseFloat(this.dataToPost[0].contract_price);      
      this.contractPriceStr = this.convertToString(
        parseFloat(this.contractPrice)
      );
       // debug 1212  // debug 1212 // debug 1212 // debug 1212 // debug 1212

      if (parseInt(this.dataToPost[0].gasStove) === 1) {
        this.gasStoveCost = 2000;
      } else {
        this.gasStoveCost = 0;
      }
      this.gasStoveStr = this.convertToString(this.gasStoveCost);
      this.finaliseCosts();

      this.balanceRemStr = this.convertToString(this.dataToPost[0].balanceRem);
      this.depositStr = this.convertToString(this.dataToPost[0].deposit);

      // debug 1212 // debug 1212 // debug 1212 // debug 1212 // debug 1212 // debug 1212
      this.basePriceStr = this.convertToString(this.dataToPost[0].base_price);
       // debug 1212 // debug 1212 // debug 1212 // debug 1212 // debug 1212 // debug 1212

      if (this.upsertMode === "Add") {
        this.dataToPost[0].depositDate = ""
      }
        console.log("NOT NULL DepDate")
         this.depositDate = this.dataToPost[0].depositDate.split(" ")[0];
      
      if (this.dataToPost[0].actualSalesdate !== null) {
        this.dataToPost[0].actualSalesdate = dayjs(
          this.dataToPost[0].actualSalesdate
        ).format("YYYY-MM-DD");
      }

  },

  methods: {
    changeBuyers() {
        console.log("this.dataToPost[0].saleBuyers=",this.dataToPost[0].saleBuyers)
    },
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
      formData.append("id", this.dataToPost[0].id);
      formData.append(
        "client",
        `${this.dataToPost[0].unit}-${this.dataToPost[0].firstname}${this.dataToPost[0].lastname}`
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
      let str = ""
      try {
      console.log("FACTOR1 === ", factor)
      if (typeof factor === "string" || factor instanceof String) {
        factor = parseFloat(factor);
      }
      console.log("FACTOR === ", factor)
      if (factor.length < 1) { console.log("") } else {
        str = factor
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
      } 
      } catch (e) {
        console.log("YO",e)
      }
      return str;
    },
    setBalanceRemaining() {
      this.balanceRem =
        parseFloat(this.contractPrice) - parseFloat(this.dataToPost[0].deposit);
      this.balanceRemStr = this.convertToString(this.balanceRem);
    },
    addAdditionalExtras() {
      console.log(this.dataToPost[0].additionalExtrasCost);
      this.finaliseCosts();
    },

    changePriceIfEnclosed() {
      let chosenFloorplan = this.dataToPost[0].floorPlans.filter(el => {
        return this.floorplan === el.plan;
      });

      this.floorplancost = chosenFloorplan[0].enclosedValue;
      this.enclosedBalcony = chosenFloorplan[0].enclosedBalcony;
      this.finaliseCosts();
    },
    changePriceIfGas() {
      if (parseInt(this.dataToPost[0].gasStove) === 1) {
        this.gasStoveCost = 2000;
      } else {
        this.gasStoveCost = 0;
      }
      this.gasStoveStr = this.convertToString(this.gasStoveCost);

      this.finaliseCosts();
    },
    finaliseCosts() {
      this.dataToPost[0].extras =
        parseFloat(this.floorplancost) +
        parseFloat(this.gasStoveCost) +
        parseFloat(this.dataToPost[0].parking);

      this.extrasStr = this.convertToString(this.dataToPost[0].extras);
      this.contractPrice =
        parseFloat(this.dataToPost[0].base_price) +
 
        parseFloat(this.dataToPost[0].extras) +
        parseFloat(this.dataToPost[0].additionalExtrasCost) -
        parseFloat(this.dataToPost[0].deductions);

      this.contractPriceStr = this.convertToString(this.contractPrice);
    },
    changePricing() {
      this.dataToPost[0].parking =
        parseFloat(this.dataToPost[0].parkingNumber) *
        parseFloat(this.parkingPrice);

      this.dataToPost[0].deductionsStr = this.convertToString(this.deductions);

      this.parkingPriceStr = this.convertToString(
        parseFloat(this.dataToPost[0].parkingNumber) *
          parseFloat(this.parkingPrice)
      );

      this.finaliseCosts();
    },
    naturalTrust() {
      if (this.dataToPost[0].salePerson === "Legal") {
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
        console.log("fileBank has data, this.fileBank = ", this.fileBank)
        contains.push("fileBank");
        files.push(this.fileBank);
      }
      if (this.personTwoFileBank !== null) {
        contains.push("personTwoFileBank");
        files.push(this.personTwoFileBank);
      }

      if (this.fileDepositPop !== null) {
        console.log("fileDepPop has data, this.fileDepositPop = ", this.fileDepositPop)
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

      formData.append("trustName", this.dataToPost[0].trustName);
      formData.append("trustNumber", this.dataToPost[0].trustNumber);
      formData.append("firstName", this.dataToPost[0].firstname);
      formData.append("lastName", this.dataToPost[0].lastname);
      formData.append("iDNumber", this.dataToPost[0].iDNumber);
      formData.append("marital", this.dataToPost[0].marital);
      formData.append("email", this.dataToPost[0].email);
      formData.append("bankName", this.dataToPost[0].bankName);
      formData.append("accountNumber", this.dataToPost[0].accountNumber);
      formData.append("accountType", this.dataToPost[0].accountType);
      formData.append("block", this.dataToPost[0].block);
      formData.append("unit", this.dataToPost[0].unit);
      formData.append("mood", this.dataToPost[0].mood);
      formData.append("flooring", this.dataToPost[0].flooring);
      formData.append("floorplan", this.dataToPost[0].floorplan);
      //formData.append("mobile", this.dataToPost[0].mobile);
      formData.append("mobile", this.mobile.phoneNumber1);
      formData.append("landline", this.landline.phoneNumber2);
      formData.append("postalAddress", this.dataToPost[0].postalAddress);
      formData.append("residentialAddress",  this.dataToPost[0].residentialAddress );
      formData.append("contract_price", this.dataToPost[0].contract_price);
      formData.append("personTwoFirstName", this.dataToPost[0].personTwoFirstName);
      formData.append("personTwoLastName", this.dataToPost[0].personTwoLastName);
      formData.append("personTwoIDNumber", this.dataToPost[0].personTwoIDNumber);
      formData.append("personTwoMarital", this.dataToPost[0].personTwoMarital);
      formData.append("personTwoEmail", this.dataToPost[0].personTwoEmail);
      formData.append("personTwoBankName", this.dataToPost[0].personTwoBankName);
      formData.append("personTwoAccountNumber", this.dataToPost[0].personTwoAccountNumber );
      formData.append("personTwoAccountType", this.dataToPost[0].personTwoAccountType );
      formData.append("personTwoMobile", this.mobile.phoneNumber3);
      formData.append("personTwoLandline", this.landline.phoneNumber4);
      formData.append("personTwoPostalAddress", this.dataToPost[0].personTwoPostalAddress );
      formData.append("personTwoResidentialAddress", this.dataToPost[0].personTwoResidentialAddress);
      formData.append("base_price", this.dataToPost[0].base_price);
      formData.append("parking", this.dataToPost[0].parking);
      formData.append("originalBayNo", this.dataToPost[0].originalBayNo);
      formData.append("extras", this.dataToPost[0].extras);
      formData.append("deductions", this.dataToPost[0].deductions);
      formData.append("salesAgent", this.dataToPost[0].salesAgent);
      formData.append("salesAgentPhone", this.mobile.phoneNumber5);
      formData.append("contains", contains);
      formData.append("id", this.dataToPost[0].id);
      formData.append("notes", this.dataToPost[0].notes);
      formData.append("cashDeal", this.dataToPost[0].cashDeal);
      formData.append("balanceRem", this.dataToPost[0].balanceRem);
      formData.append("deposit", this.dataToPost[0].deposit);
      formData.append("depositDate", this.depositDate);
      formData.append("gasStove", this.dataToPost[0].gasStove);
      formData.append("additionalExtras", this.dataToPost[0].additionalExtras);
      formData.append( "additionalExtrasCost", this.dataToPost[0].additionalExtrasCost );
      formData.append("spareRoom", this.dataToPost[0].spareRoom);
      formData.append("enclosedBalcony", this.dataToPost[0].enclosedBalcony);
      formData.append("saleType", this.dataToPost[0].saleType);
      formData.append("salePerson", this.dataToPost[0].salePerson);
      formData.append("saleBuyers", this.dataToPost[0].saleBuyers);
      formData.append("development", this.$store.state.development.id);
 
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

      formData.append("trustName", this.dataToPost[0].trustName);
      formData.append("trustNumber", this.dataToPost[0].trustNumber);
      formData.append("firstName", this.dataToPost[0].firstname);
      formData.append("lastName", this.dataToPost[0].lastname);
      formData.append("iDNumber", this.dataToPost[0].iDNumber);
      formData.append("marital", this.marital);
      formData.append("email", this.dataToPost[0].email);
      formData.append("bankName", this.dataToPost[0].bankName);
      formData.append("accountNumber", this.dataToPost[0].accountNumber);
      formData.append("accountType", this.dataToPost[0].accountType);
      formData.append("block", this.dataToPost[0].blockValue);
      formData.append("unit", this.unitValue);
      formData.append("mood", this.dataToPost[0].mood);
      formData.append("flooring", this.dataToPost[0].flooring);
      formData.append("floorplan", this.dataToPost[0].floorplan);
      formData.append("mobile", this.dataToPost[0].mobile);
      formData.append("landline", this.dataToPost[0].landline);
      formData.append("postalAddress", this.dataToPost[0].postalAddress);
      formData.append( "residentialAddress",  this.dataToPost[0].residentialAddress );
      formData.append("contract_price", this.dataToPost[0].contract_price);
      formData.append("personTwoFirstName", this.dataToPost[0].personTwoFirstName);
      formData.append("personTwoLastName", this.dataToPost[0].personTwoLastName);
      formData.append("personTwoIDNumber", this.dataToPost[0].personTwoIDNumber);
      formData.append("personTwoMarital", this.dataToPost[0].personTwoMarital);
      formData.append("personTwoEmail", this.dataToPost[0].personTwoEmail);
      formData.append("personTwoBankName", this.dataToPost[0].personTwoBankName);
      formData.append( "personTwoAccountNumber", this.dataToPost[0].personTwoAccountNumber );
      formData.append("personTwoAccountType", this.dataToPost[0].personTwoAccountType );
      formData.append("personTwoMobile", this.dataToPost[0].personTwoMobile);
      formData.append("personTwoLandline", this.dataToPost[0].personTwoLandline);
      formData.append( "personTwoPostalAddress", this.dataToPost[0].personTwoPostalAddress );
      formData.append( "personTwoResidentialAddress", this.dataToPost[0].personTwoResidentialAddress);
      formData.append("base_price", this.dataToPost[0].base_price);
      formData.append("parking", this.dataToPost[0].parking);
      formData.append("originalBayNo", this.dataToPost[0].originalBayNo);
      formData.append("extras", this.dataToPost[0].extras);
      formData.append("deductions", this.dataToPost[0].deductions);
      formData.append("salesAgent", this.dataToPost[0].salesAgent);
      formData.append("salesAgentPhone", this.dataToPost[0].salesAgentPhone);
      formData.append("contains", contains);
      formData.append("id", this.dataToPost[0].id);
      formData.append("notes", this.dataToPost[0].notes);
      formData.append("cashDeal", this.dataToPost[0].cashDeal);
      formData.append("balanceRem", this.dataToPost[0].balanceRem);
      formData.append("deposit", this.dataToPost[0].deposit);
      formData.append("depositDate", this.depositDate);
      formData.append("gasStove", this.dataToPost[0].gasStove);
      formData.append("additionalExtras", this.dataToPost[0].additionalExtras);
      formData.append( "additionalExtrasCost", this.dataToPost[0].additionalExtrasCost );
      formData.append("spareRoom", this.dataToPost[0].spareRoom);
      formData.append("enclosedBalcony", this.dataToPost[0].enclosedBalcony);
      formData.append("saleType", this.dataToPost[0].saleType);
      formData.append("salePerson", this.dataToPost[0].salePerson);
      formData.append("saleBuyers", this.dataToPost[0].saleBuyers);
      formData.append("development", this.$store.state.development.id);
 
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
