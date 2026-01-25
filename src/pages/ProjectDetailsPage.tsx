import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Mock Data (based on "Résidence Azurite" screenshot)
const projectData = {
  title: "RÉSIDENCE AZURITE",
  status: "EN COURS DE RÉALISATION",
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim. Mauris ut mauris fringilla, vulputate orci at, placerat risus. Vestibulum sit amet purus et leo montes, nascetur ridiculus mus. In nunc dapibus varius fringilla.`,
  stats: {
    address: "Kouba",
    blocs: "01",
    progress: "01 %",
  },
  heroImage: "/galeries/maindetail.jpg", // Updated per user request
  amenities: [
    { label: "RECEPTION", svg: <svg width="79" height="78" viewBox="0 0 79 78" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M78.3924 76.1229C78.3592 75.9268 78.0495 75.3234 77.8924 75.3234H71.2426L70.9992 75.0812V47.8716H7.41224V75.0812L7.1689 75.3234H0.519076C0.362011 75.3234 0.052305 75.9246 0.0191223 76.1229C-0.149004 77.1447 0.824357 77.4046 1.6495 77.4288H76.6027C77.4588 77.4354 78.5715 77.2108 78.3924 76.1229ZM62.5244 65.3536C62.2921 66.8137 61.1904 67.7783 59.7237 67.8928L18.2719 67.8224C17.2034 67.6352 16.3318 66.9238 16.0176 65.8689C15.6593 64.662 15.719 59.7245 15.8407 58.282C15.9889 56.5553 16.8273 55.5004 18.5661 55.1811L59.9781 55.2119C61.301 55.4366 62.2655 56.3946 62.4934 57.716C62.7301 59.0946 62.7456 63.9727 62.5266 65.3558L62.5244 65.3536Z" fill="currentColor"/><path d="M75.2243 39.3047H3.18457V45.7795H75.2243V39.3047Z" fill="currentColor"/><path d="M13.4203 31.971C13.8649 31.6781 14.1636 27.2646 14.4622 26.3881C14.5242 26.2075 14.7056 25.908 14.8737 25.8287C15.221 25.6636 19.7737 25.6812 20.4772 25.7406C20.7293 25.7627 21.143 25.7671 21.3244 25.9477C21.935 26.5533 22.1407 31.9445 22.6053 32.0525C25.5961 31.8058 29.056 32.3608 31.9894 32.0459C32.3145 32.0106 32.8787 31.8829 32.8787 31.4799V20.4177H3.19336V31.6406L4.08266 32.0481L13.4181 31.971H13.4203Z" fill="currentColor"/><path d="M55.8349 17.1846C67.0639 18.1823 67.5418 0.00440551 56.6424 8.90619e-07C46.5791 -0.00440373 46.1964 16.3301 55.8349 17.1846Z" fill="currentColor"/><path d="M32.8787 18.0765V15.654C32.8787 15.5901 32.6906 15.2906 32.6066 15.2378L3.52076 15.1717C3.44555 15.2069 3.20884 15.4382 3.19336 15.4932V18.3188H32.6353L32.8787 18.0765Z" fill="currentColor"/><path d="M65.9688 26.811C66.0728 27.8043 64.0862 29.1631 63.5664 30.0242C64.0641 30.8567 65.1813 31.7068 64.9932 32.7617C64.8716 33.4444 62.2745 35.9484 61.6727 36.7258C61.5467 36.8888 61.3608 36.9307 61.4316 37.2125H71.0015V26.7956C71.0015 25.2474 68.4354 22.5165 66.8647 22.5165H64.188C64.3207 23.7741 65.8493 25.6504 65.971 26.811H65.9688Z" fill="currentColor"/><path d="M51.2046 36.1664C50.6714 35.5014 48.342 33.1801 48.2867 32.5943C48.2159 31.8213 49.4437 30.751 49.7534 30.0264C49.7556 29.5705 47.3133 27.8175 47.3554 26.985L49.2623 22.5165H46.5855C45.1299 22.5165 42.4487 25.025 42.4487 26.4719V37.2103H51.8571C51.8018 36.847 51.4346 36.4527 51.2046 36.1642V36.1664Z" fill="currentColor"/><path d="M50.7951 32.5216L54.6842 37.0605L55.7504 37.2103V23.807L51.3725 22.838L49.751 26.6392C50.0629 27.6721 52.0583 28.7842 52.1777 29.718C52.2972 30.643 51.211 31.4358 50.7929 32.2154V32.5238L50.7951 32.5216Z" fill="currentColor"/><path d="M62.4848 32.6889C62.8564 31.9049 60.9894 30.6496 61.1309 29.74C61.2504 28.9648 63.7103 27.0422 63.6749 26.6656L61.9185 22.9084L57.8613 23.8092V37.2124L58.6378 37.1772L62.4848 32.6889Z" fill="currentColor"/><path d="M16.427 27.8373L14.874 37.2125H21.2009L19.7408 27.8461L16.427 27.8373Z" fill="currentColor"/><path d="M60.9272 20.8075L60.1109 18.821C57.8412 19.3959 55.6932 19.4972 53.4235 18.8188L52.3506 20.8207C54.9123 22.0452 58.3744 22.0496 60.9272 20.8053V20.8075Z" fill="currentColor"/><path d="M60.2925 57.39H18.1172V65.6333H60.2925V57.39Z" fill="currentColor"/></svg> },
    { label: "DOMOTIQUE", svg: <svg width="79" height="78" viewBox="0 0 79 78" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.2207 31.2903L32.8426 12.8817C34.0795 12.1181 34.8074 12.1047 36.0666 12.817L46.8952 21.2454C45.8749 21.4709 44.0485 23.2459 44.0485 24.2595V27.0236C40.7732 25.8939 37.9689 23.7192 35.1267 21.7969L33.9925 21.741C29.5472 25.2174 24.5794 27.4925 19.3058 29.4081C17.2272 39.7633 18.895 50.0159 28.6965 55.5172C29.9647 56.2295 33.5705 57.9844 34.9056 57.8191C35.5643 57.7388 37.2678 56.9886 37.9644 56.6894C40.1681 55.7427 42.144 54.4143 44.0463 52.9764V61.7688C44.0463 61.8268 44.3433 61.9541 43.9615 62.1885H9.2207V31.2925V31.2903Z" fill="currentColor"/><path d="M70.0064 57.4977C67.9211 55.8678 66.1729 53.3426 64.1478 51.7195C59.7874 48.2208 53.7501 53.0077 56.2999 58.0603C57.2599 59.9626 59.5284 61.3089 60.7965 63.0236H47.6504C47.0119 63.0236 45.8777 61.675 46.054 60.936V25.0857C46.0585 24.3266 46.4894 23.6768 47.1369 23.3241L68.256 23.1611C68.7829 22.9445 70.0064 24.0743 70.0064 24.4248V57.4954V57.4977ZM67.9568 35.8562C69.1156 34.6974 66.1461 32.813 65.3043 32.3084C61.386 29.9641 56.6326 29.6895 52.4284 31.4622C51.3254 31.9289 47.8715 33.8758 47.8871 35.1439C47.896 35.7914 48.5167 36.171 49.1486 36.0616C49.345 36.0281 51.3835 34.3045 51.9327 33.9807C55.9136 31.6297 60.9216 31.7927 64.7663 34.3491C65.5723 34.885 67.0392 36.7693 67.9546 35.8539L67.9568 35.8562ZM64.9404 38.8658C65.9675 37.8879 64.5653 36.8765 63.795 36.3295C60.3098 33.8579 55.3443 33.8468 52.0086 36.5706C51.3969 37.0708 50.419 37.7674 51.0709 38.6716C51.8457 39.75 53.2478 38.0688 54.0471 37.6044C56.6638 36.0817 59.8007 36.1509 62.3572 37.7674C63.0292 38.1916 64.1433 39.6227 64.9382 38.8658H64.9404ZM62.0915 41.7148C63.2681 40.4756 60.1825 38.9507 59.189 38.7609C58.1954 38.5711 57.03 38.6872 56.1101 38.9976C55.1992 39.3035 53.0111 40.6029 54.0895 41.6835C54.9781 42.5721 55.9806 41.141 56.8045 40.8663C57.6283 40.5917 58.8295 40.6453 59.6244 41.0025C60.3411 41.324 61.1783 42.6748 62.0915 41.7148ZM60.4795 44.49C60.4795 43.1482 59.3922 42.0631 58.0525 42.0631C56.7129 42.0631 55.6256 43.1504 55.6256 44.49C55.6256 45.8296 56.7129 46.9169 58.0525 46.9169C59.3922 46.9169 60.4795 45.8296 60.4795 44.49Z" fill="currentColor"/><path d="M62.4709 21.1606H49.9946L37.3062 11.243C35.7277 10.2517 34.4416 9.97261 32.6644 10.696C23.6443 17.278 14.9725 24.3869 6.09086 31.1765C1.65003 33.7954 -2.24603 28.2003 1.51383 24.925C11.811 17.4298 21.5344 8.76249 31.845 1.33432C34.1268 -0.308946 34.6158 -0.514353 37.0003 1.16686C44.9867 6.79772 53.5379 13.824 61.2072 19.9952C61.6403 20.3435 62.1717 20.6962 62.4709 21.1606Z" fill="currentColor"/><path d="M34.4527 23.8668C36.0178 24.7621 37.4199 25.912 38.9761 26.8229C40.6172 27.783 42.4502 28.4796 44.0242 29.4776L43.964 50.1278C41.4477 52.9119 37.9982 54.7293 34.4326 55.8189C30.8357 54.5708 27.3214 52.8003 24.7896 49.8844C20.2438 44.6487 19.9848 37.3076 21.1079 30.7882C25.9126 29.2119 30.4204 26.9077 34.4527 23.8691V23.8668ZM39.3624 36.7338V34.1394C39.3624 32.0965 36.5291 30.0893 34.5889 30.0715C32.4656 30.0536 29.6501 32.063 29.6501 34.3069V36.7361C28.2726 36.6155 27.1026 36.8231 26.8436 38.3682C26.6025 39.8038 26.6315 44.6867 26.8035 46.1982C26.9642 47.6093 27.7457 48.0179 29.0585 48.1295C31.9096 48.3729 36.9176 48.3438 39.7888 48.1295C40.8538 41.9255 47.8772 42.1711 46.6604C42.4346 45.3565 42.3542 40.1342 42.2158 38.6539C42.0505 36.8946 40.9655 36.6155 39.3624 36.7338Z" fill="currentColor"/><path d="M78.3784 77.4244H69.6709V74.4951C69.6709 72.738 67.8245 71.6083 66.9917 70.4763C66.1589 69.3443 66.6434 68.2749 66.4737 66.9754C66.1008 64.1198 60.1686 60.1568 58.3802 57.6539C56.172 54.5617 59.8828 50.9916 62.8076 53.2265C65.0716 54.9546 67.139 58.0089 69.4387 59.8241C70.1041 60.4337 72.013 59.7103 72.013 58.9244V40.9244C72.4417 41.3062 72.7543 41.976 73.0467 42.4873C74.0492 44.2377 78.3762 51.6078 78.3762 53.0658V77.4289L78.3784 77.4244Z" fill="currentColor"/><path d="M6.6647 64.2338L45.3127 64.1914C46.2928 64.4817 46.9113 64.9461 47.983 65.0376C52.685 65.4439 57.9564 64.7183 62.721 65.0376C65.264 66.279 64.3955 68.9448 61.8882 69.3891H7.12687C4.2333 68.9203 3.85374 65.2184 6.66247 64.2361L6.6647 64.2338Z" fill="currentColor"/><path d="M40.1997 38.743V46.1109H28.813V38.743H40.1997ZM35.5513 43.1347C35.683 42.907 36.3327 42.6301 36.4801 41.9737C37.1275 39.0846 32.4992 38.58 32.4925 41.5071C32.4902 42.5453 33.332 42.744 33.4659 43.2151C33.6445 43.8425 33.265 44.8494 34.2608 45.1084C35.9442 45.3919 35.29 43.5835 35.549 43.1347H35.5513Z" fill="currentColor"/><path d="M37.3529 36.7337H31.6595C31.3402 34.7131 32.0859 31.9937 34.5732 32.0607C35.5578 32.0875 37.3529 33.2797 37.3529 34.3068V36.7359V36.7337Z" fill="currentColor"/></svg> },
    { label: "CLIMATISATION CENTRALISÉE", svg: <svg width="78" height="45" viewBox="0 0 78 45" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38.4941 33.4756C39.2525 33.3193 39.9969 33.8154 40.0957 34.5576L40.1533 35.0898C40.3867 37.806 39.8243 41.1549 40.085 43.8672C39.2163 45.5377 37.5451 45.0637 37.3359 43.1816C37.1475 41.4877 37.1205 36.5724 37.3525 34.9248C37.44 34.3045 37.8349 33.6135 38.4941 33.4756ZM30.7568 33.4756C33.8153 32.8393 31.9291 39.3058 31.5361 40.6455C31.304 41.4362 30.3985 44.4437 29.7666 44.7314C28.8199 45.1611 27.5954 44.4831 27.71 43.3779C28.6613 40.8294 29.4081 38.308 29.7666 35.5986C29.8768 34.7761 29.5113 33.7354 30.7539 33.4756H30.7568ZM46.0635 33.4756C47.8444 33.1056 47.5347 34.8293 47.6611 35.7715C48.0128 38.3911 48.8239 40.9054 49.7178 43.3779C49.8186 44.8208 47.9416 45.4755 47.1074 44.0811C46.2135 42.5873 44.7653 36.8096 44.9238 35.1045C44.9859 34.4221 45.3101 33.632 46.0635 33.4756ZM21.457 33.8223C21.8592 32.3194 23.7385 32.4735 24.0557 33.5674C24.4737 35.0062 23.1296 39.9139 22.5459 41.4629C22.1392 42.5383 21.0797 45.3237 19.4941 43.7383C19.2781 43.5223 19.0736 42.8371 19.1035 42.5107C19.6894 41.2056 20.227 39.866 20.6016 38.4805C21.0221 36.927 21.0756 35.2447 21.457 33.8223ZM53.5576 33.1494C53.9759 32.6324 55.1941 32.5884 55.6514 33.1055C56.0351 33.5402 56.5429 37.4371 56.8232 38.4805C57.1978 39.8731 57.7222 41.1989 58.3174 42.5088C58.4828 43.7565 56.835 44.6919 55.9111 43.7041C55.1322 42.8723 54.0084 38.8328 53.7578 37.5869C53.5671 36.6379 52.9995 33.8415 53.5576 33.1494ZM72.6914 0C75.0469 0.0505564 76.9111 1.96939 77.2236 4.24902L77.2256 4.24707C76.8373 10.8077 77.8093 18.0967 77.251 24.5723C76.7638 30.2185 70.492 29.0747 66.4912 29.1367C66.2459 29.1343 66.1953 29.0331 66.0967 28.8428C65.5889 27.8616 65.462 24.8491 65.0576 23.5068C64.6256 22.0844 63.7364 20.9047 62.1738 20.707L15.4043 20.6865C11.5623 21.121 12.2031 26.3539 11.2012 29.0586C7.06477 29.0679 1.21457 30.3515 0.201172 24.8916C0.587164 18.3286 -0.378026 11.0463 0.175781 4.56836C0.366518 2.32792 1.86223 0.487176 4.0957 0.0527344L72.6914 0ZM61.9893 23.4424C62.4787 23.562 63.1566 28.3648 63.3105 29.1367H14.1143L15.3467 23.4785L61.9893 23.4424ZM14.334 6.93945C13.5733 6.7694 9.36508 6.78112 8.5332 6.91211C7.4304 7.08464 6.98485 8.50933 7.80273 9.26074C8.03254 9.47216 8.54518 9.62827 8.8623 9.66504C9.88966 9.77993 13.0377 9.80533 14.0166 9.65137C15.5423 9.41003 15.7378 7.25212 14.334 6.93945Z" fill="currentColor"/> </svg> },
    { label: "ABATTOIR", svg: <svg width="78" height="76" viewBox="0 0 78 76" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36.5995 0.133394C40.109 -0.309912 43.6185 0.281162 46.0752 2.97794C51.2656 0.484343 56.9362 3.10723 58.968 8.31607C64.6386 8.44537 69.5888 12.4905 69.0901 18.4567C74.6869 20.3407 76.534 26.196 74.576 31.4788C76.5709 33.4736 77.9562 36.1889 77.2359 39.0519C76.811 40.7697 75.8321 42.2843 74.576 43.5034C76.5709 48.86 74.6684 54.5676 69.0901 56.5255C69.5888 62.4917 64.6386 66.5184 58.968 66.6661C56.9177 71.838 51.2102 74.4978 46.0752 72.0043C42.1778 76.0125 35.2512 76.0125 31.3538 72.0043C26.1634 74.4794 20.5113 71.8934 18.461 66.6661C12.8458 66.4999 7.80317 62.4917 8.33883 56.5255C2.72363 54.623 0.91347 48.8046 2.85293 43.5034C0.858057 41.5085 -0.527272 38.7933 0.1931 35.9303C0.617934 34.2125 1.5969 32.6979 2.85293 31.4788C0.858057 26.1776 2.76058 20.3407 8.33883 18.4567C7.82164 12.4905 12.8273 8.50078 18.461 8.31607C20.5113 3.10723 26.1819 0.484343 31.3538 2.97794C32.7391 1.61108 34.6231 0.373517 36.5995 0.133394ZM54.8489 42.3582C56.9731 42.3582 58.7648 42.4875 60.8151 41.8226C66.3379 40.0309 69.1086 34.6004 68.2959 28.9667C68.2035 28.3572 67.9819 27.5629 67.3169 27.3597H58.9865C57.989 27.6553 57.8413 29.3177 57.4718 30.1673C55.9018 33.6953 52.4292 34.9698 48.772 34.3048C47.5898 34.0832 45.9644 33.0673 44.9854 33.6214C42.6581 34.9144 41.2543 37.1863 38.0033 36.7615C35.5098 36.429 34.3276 34.5819 32.499 33.6214C31.4646 33.0673 29.7653 34.1201 28.5646 34.3418C24.9443 34.9883 21.5456 33.6214 20.0125 30.1673C19.6062 29.2622 19.4953 27.5629 18.3686 27.3228C15.9674 27.5075 12.7534 26.9349 10.4445 27.3043C9.46557 27.4521 9.22544 28.431 9.13309 29.2807C8.65284 34.1755 10.5184 38.9595 15.0808 41.1761C17.5928 42.3952 19.8648 42.4875 22.6354 42.3767C23.7991 46.2371 24.5934 50.467 25.9048 54.272C29.913 66.0196 46.6847 66.7031 51.3579 54.8816C52.891 51.0027 53.5929 46.3849 54.8859 42.3767L54.8489 42.3582Z" fill="currentColor"/></svg> },
    { label: "AIRE DE JEUX", svg: <svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.66602 75.1602C9.66597 76.413 8.65021 77.4288 7.39746 77.4288C6.14486 77.4286 5.12896 76.4128 5.12891 75.1602V38.3887H9.66602V75.1602ZM18.5469 42.9835H26.8174V38.3887H31.3545V75.1602C31.3544 76.4129 30.3387 77.4288 29.0859 77.4288C27.8332 77.4288 26.8174 76.413 26.8174 75.1602V73.9415H18.5469V75.1602C18.5468 76.4128 17.5319 77.4286 16.2793 77.4288C15.0265 77.4288 14.0108 76.413 14.0107 75.1602V38.3887H18.5469V42.9835ZM40.1396 75.1602C40.1397 75.3191 40.1564 75.4744 40.1875 75.6241C39.9733 76.6543 39.0605 77.4287 37.9668 77.4288C36.714 77.4288 35.6983 76.413 35.6982 75.1602V38.3887H40.1396V75.1602ZM21.3896 0.408264C22.1701 -0.136482 23.2081 -0.135996 23.9883 0.409241L44.3955 14.6739C45.4224 15.3916 45.673 16.8062 44.9551 17.8331C44.5139 18.4643 43.8095 18.8018 43.0938 18.8018C42.645 18.8018 42.1916 18.6692 41.7959 18.3926L40.1377 17.2335V23.9366H44.1113C46.9597 23.9366 49.2686 26.2456 49.2686 29.0938V34.6993C54.3371 34.7988 58.4416 37.9289 60.335 42.6641L68.376 65.5079C68.8057 66.5829 69.8471 67.288 71.0049 67.2881H75.75C76.6774 67.2881 77.4296 68.0396 77.4297 68.9669V75.7491C77.4297 76.6766 76.6773 77.4288 75.75 77.4288H70.6406C65.5619 77.4286 60.9991 74.3234 59.1357 69.5987L51.4639 46.2842C50.9751 45.0008 49.7445 44.1524 48.3711 44.1524H44.6768V34.6944H44.7324V29.0938C44.7324 28.7511 44.454 28.4737 44.1113 28.4737H40.1377V34.1768H31.3545V25.6348C31.3545 20.8084 27.3909 16.8902 22.5479 16.9639C17.7894 17.0364 14.0107 21.0078 14.0107 25.7667V34.1768H5.16504V17.2774L3.62012 18.3565C2.61884 19.0559 1.21944 18.8881 0.473633 17.921C-0.322438 16.8882 -0.0869507 15.4123 0.969727 14.6739L21.3896 0.408264ZM18.5469 69.4044H26.8174V65.1348H18.5469V69.4044ZM18.5469 60.5977H26.8174V56.3272H18.5469V60.5977ZM18.5469 51.7901H26.8174V47.5206H18.5469V51.7901ZM22.6826 21.5001C24.9626 21.5002 26.8174 23.3549 26.8174 25.6348V34.1768H18.5469V25.6348C18.5469 23.3548 20.4025 21.5001 22.6826 21.5001Z" fill="currentColor"/></svg> },
  ],
  gallery: [
    "/galeries/galerie1.jpg",
    "/galeries/galerie2.jpg",
    "/galeries/galerie3.jpg",
  ],
  plans: [
    { type: "F3", area: "67 à 142 m2", image: "/plans/F3.jpg" },
    { type: "F4", area: "80 à 160 m2", image: "/plans/F4.png" },
    { type: "DUPLEX EN F5", area: "150 à 220 m2", image: "/plans/F5.png" },
  ],
  location: {
    // Embed URL for Google Maps (Kouba, Alger placeholder)
    mapUrl: "https://maps.app.goo.gl/g7gGUgT9xbBR2jzV8",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique pulvinar enim.",
  },
};

type ProjectData = typeof projectData;
type Amenity = {
  label: string;
  svg?: React.ReactNode;
  icon?: string;
};
type Plan = ProjectData["plans"][0];
type LocationData = ProjectData["location"];

export default function ProjectDetailsPage() {
  return (
    <div className="relative min-h-screen bg-[#031B17] text-white font-['Montserrat']">
      {/* Background Texture & Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(21,105,83,0.3),transparent_70%)]" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(225,187,127,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ 
          backgroundImage: 'url("/texture.png")', 
          backgroundSize: '1200px', 
          backgroundRepeat: 'repeat' 
        }} />
      </div>
      
      <div className="relative z-10">
        <Header className="absolute top-0 left-0 z-40 w-full" />
        
        <FadeInSection>
          <DetailsHero data={projectData} />
        </FadeInSection>
        <FadeInSection delay={200}>
          <AmenitiesList amenities={projectData.amenities} />
        </FadeInSection>
        <FadeInSection delay={300}>
          <ProjectGallery images={projectData.gallery} />
        </FadeInSection>
        <FadeInSection delay={400}>
          <PlansAndLocation plans={projectData.plans} location={projectData.location} />
        </FadeInSection>
        <FadeInSection delay={500}>
          <DetailsContact />
        </FadeInSection>
        
        <Footer />
      </div>
    </div>
  );
}

// --- Sub-components ---

function DetailsHero({ data }: { data: typeof projectData }) {
  return (
    <section className="w-full px-4 pt-32 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-gradient-to-br from-[#1A4D43] to-[#0A221D] shadow-2xl border border-white/5">
        <div className="flex flex-col gap-10 p-8 md:flex-row md:items-center md:p-12 lg:gap-16">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold uppercase leading-tight text-white md:text-4xl lg:text-5xl">
                {data.title}
              </h1>
              <p className="text-sm font-bold uppercase tracking-widest text-[#F7C66A]">
                {data.status}
              </p>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              {data.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <StatBox label="Adresse" value={data.stats.address} />
              <StatBox label="Blocs" value={data.stats.blocs} />
              <StatBox label="Etat D'avancement" value={data.stats.progress} />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[300px] w-full flex-1 overflow-hidden rounded-2xl md:h-[400px]">
            <img
              src={data.heroImage}
              alt={data.title}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[140px] rounded-lg bg-white/10 px-5 py-4 backdrop-blur-sm border border-white/5">
      <div className="text-xs font-medium text-white/60 uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function AmenitiesList({ amenities }: { amenities: Amenity[] }) {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-10 md:gap-20">
        {amenities.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-4 text-center group">
            <div className="flex h-24 w-24 items-center justify-center text-4xl text-white transition-all duration-300 group-hover:scale-110 group-hover:text-[#F7C66A]">
               {/* Render SVG if available, otherwise fallback to Icon */}
               {item.svg ? (
                 <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current">
                   {item.svg}
                 </div>
               ) : (
                 <i className={item.icon}></i>
               )}
            </div>
            <span className="max-w-[120px] text-xs font-bold uppercase tracking-wider text-white">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  // Duplicate images to create a longer strip for scrolling effect
  const displayImages = [...images, ...images];

  useEffect(() => {
    const handleResize = () => {
      // Tailwind md breakpoint is 768px
      if (window.innerWidth >= 768) {
        setItemsPerView(3);
      } else {
        setItemsPerView(1);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = displayImages.length - itemsPerView;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = displayImages.length - itemsPerView;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  return (
    <section className="py-20 px-4 md:px-8">
       <div className="mx-auto max-w-7xl relative group">
         
         {/* Arrows */}
         <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-2 md:-translate-x-12 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#031B17] shadow-xl transition hover:scale-110 active:scale-95"
            aria-label="Previous slide"
         >
           <i className="fa-solid fa-chevron-left"></i>
         </button>

         <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-2 md:translate-x-12 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#031B17] shadow-xl transition hover:scale-110 active:scale-95"
            aria-label="Next slide"
         >
           <i className="fa-solid fa-chevron-right"></i>
         </button>

         {/* Carousel Window */}
         <div className="overflow-hidden px-2 md:px-0">
           <div 
             className="flex transition-transform duration-500 ease-out"
             style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
           >
             {displayImages.map((img, idx) => (
               <div 
                 key={idx} 
                 className="flex-shrink-0 px-3"
                 style={{ width: `${100 / itemsPerView}%` }}
               >
                 <div className="overflow-hidden rounded-xl border border-white/10 shadow-lg group relative aspect-square">
                    <img 
                      src={img} 
                      alt={`Gallery ${idx}`} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
    </section>
  );
}


function PlansAndLocation({ plans, location }: { plans: Plan[]; location: LocationData }) {
  const [activeTab, setActiveTab] = useState(plans[0].type);
  const currentPlan = plans.find(p => p.type === activeTab) || plans[0];

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
      {/* Left: Typologies */}
      <div className="flex flex-col rounded-3xl bg-[#052620] p-8 shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold uppercase tracking-wide">Typologies</h2>
        <p className="mb-8 text-[#F7C66A] font-bold">
          <span className="font-extrabold">{activeTab}</span> {currentPlan.area}
        </p>
        
        <div className="mb-8 flex-1 flex items-center justify-center">
           {/* Plan Image */}
           <img src={currentPlan.image} alt={activeTab} className="max-h-[500px] w-full object-contain filter invert opacity-90" />
        </div>

        <div className="flex flex-wrap gap-4">
          {plans.map((p) => (
            <button
              key={p.type}
              onClick={() => setActiveTab(p.type)}
              className={`rounded-full border px-8 py-3 text-sm font-bold uppercase transition-all
                ${activeTab === p.type 
                  ? "border-[#F7C66A] bg-[#F7C66A] text-[#031B17]" 
                  : "border-white/30 text-white hover:border-white"
                }
              `}
            >
              {p.type}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Localisation */}
      <div className="flex flex-col rounded-3xl bg-[#052620] p-8 shadow-2xl">
        <h2 className="mb-8 text-2xl font-bold uppercase tracking-wide">Localisation</h2>
        
        <a 
          href={location.mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative mb-6 aspect-square w-full overflow-hidden rounded-2xl bg-gray-800"
        >
           {/* Map Image Placeholder - using a dark map style image or generic placeholder */}
           <img 
             src="/sections/map-placeholder.png" 
             onError={(e) => {
               e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"; // Fallback generic map image
             }}
             alt="Localisation" 
             className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40" 
           />
           
           {/* Overlay Button */}
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex items-center gap-3 rounded-full bg-[#F7C66A] px-6 py-3 text-[#031B17] shadow-lg transition-transform duration-300 group-hover:scale-105">
               <i className="fa-solid fa-location-dot text-lg"></i>
               <span className="font-bold uppercase tracking-wide text-sm">Voir sur la carte</span>
             </div>
           </div>
        </a>

        <p className="text-white/70 text-sm leading-relaxed">
          {location.description}
        </p>
      </div>
    </section>
  );
}

function DetailsContact() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-12 text-3xl font-bold uppercase tracking-wide text-white">Devis</h2>
      
      <form className="grid gap-10 lg:grid-cols-2">
        {/* Left Column - Personal & Project Info */}
        <div className="space-y-6">
           <InputGroup label="Email*" type="email" placeholder="" />
           <div className="grid grid-cols-2 gap-4">
             <InputGroup label="Nom*" type="text" placeholder="" />
             <InputGroup label="Prénom*" type="text" placeholder="" />
           </div>
           
           {/* Phone */}
           <div className="border-b border-white/20 pt-4">
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border-r border-white/20 pr-3">
                   <img src="https://flagcdn.com/w20/dz.png" alt="DZ" className="h-4 w-6 object-cover" />
                   <span className="text-white">+213</span>
                </div>
                <input 
                  type="tel" 
                  className="w-full bg-transparent py-2 text-white placeholder-white/50 focus:outline-none focus:placeholder-[#F7C66A] transition-colors" 
                  placeholder="Téléphone"
                />
             </div>
           </div>

           <SelectGroup label="Pays" options={["Algeria", "France", "Canada", "Autre"]} />
           <SelectGroup label="Wilaya *" options={["Alger", "Oran", "Constantine", "Autre"]} />
           <SelectGroup label="Budget estimé *" options={["< 20M DA", "20M DA - 40M DA", "> 40M DA"]} />
           <SelectGroup label="Secteur d'activité *" options={["Salarié", "Profession Libérale", "Commerçant", "Autre"]} />
           <SelectGroup label="Type de financement *" options={["Fonds Propres", "Crédit Bancaire", "Mixte"]} />
           <SelectGroup label="Intéressé par *" options={["Appartement", "Duplex", "Local Commercial", "Bureau"]} />
        </div>

        {/* Right Column - Preferences */}
        <div className="space-y-8">
           {/* Localisation */}
           <div>
             <label className="mb-4 block text-sm font-bold uppercase text-[#F7C66A]">Localisation souhaitée</label>
             <div className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
                {["Hydra", "Dely Ibrahim", "Draria", "Ruisseau", "Birkhadem", "Bad Ezzouar", "El Achour", "Kouba", "Dar el Beida", "Chéraga", "Said Hamdine"].map(loc => (
                  <label key={loc} className="flex items-center gap-3 text-white/80 cursor-pointer hover:text-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/30 bg-transparent text-[#F7C66A] focus:ring-[#F7C66A]" />
                    <span className="text-sm">{loc}</span>
                  </label>
                ))}
             </div>
           </div>

           {/* Jours de contact */}
           <div>
             <label className="mb-4 block text-sm font-bold uppercase text-[#F7C66A]">Jours de contact préférés *</label>
             <div className="grid grid-cols-2 gap-y-3 sm:grid-cols-3">
                {["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"].map(day => (
                  <label key={day} className="flex items-center gap-3 text-white/80 cursor-pointer hover:text-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/30 bg-transparent text-[#F7C66A] focus:ring-[#F7C66A]" />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
             </div>
           </div>

           <SelectGroup label="Heure de contact préférée" options={["Matin (9h-12h)", "Après-midi (13h-17h)", "Soir (17h-20h)"]} />
           <SelectGroup label="Statut du projet *" options={["Urgent", "Moyen terme", "Long terme"]} />
        </div>

        {/* Bottom Full Width */}
        <div className="lg:col-span-2 pt-8 border-t border-white/10">
          <label className="flex items-center gap-3 text-sm text-white/60 cursor-pointer mb-8">
             <input type="checkbox" className="h-4 w-4 rounded border-white/30 bg-transparent text-[#F7C66A]" />
             <span>J'accepte de recevoir des communications d'Aymen Promotion</span>
          </label>
          
          <button type="submit" className="w-full rounded-none border border-[#F7C66A] bg-[#F7C66A] py-4 text-sm font-bold uppercase tracking-widest text-[#031B17] transition hover:bg-transparent hover:text-[#F7C66A]">
             Envoyer
          </button>
        </div>
      </form>
    </section>
  );
}

function InputGroup({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  const displayPlaceholder = placeholder || label;
  return (
    <div className="border-b border-white/20 pt-4">
      <input 
        type={type} 
        placeholder={displayPlaceholder}
        className="w-full bg-transparent py-2 text-white placeholder-white/50 focus:outline-none focus:placeholder-[#F7C66A] transition-colors" 
      />
    </div>
  );
}

function SelectGroup({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="relative border-b border-white/20 pt-4">
       <select className="w-full appearance-none bg-transparent py-2 text-white/70 focus:text-white focus:outline-none [&>option]:bg-[#031B17]">
          <option value="" disabled selected>{label}</option>
          {options.map(o => <option key={o} value={o} className="text-white">{o}</option>)}
       </select>
       <div className="pointer-events-none absolute right-0 top-1/2 mt-2 -translate-y-1/2 text-white/50">
         <i className="fa-solid fa-chevron-down text-xs"></i>
       </div>
    </div>
  );
}

function useOnScreen(ref: React.RefObject<HTMLElement>, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return isIntersecting;
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref as React.RefObject<HTMLElement>);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
