Rcom.createNS("Rcom.App.MainPage");

Rcom.App.MainPage.Slider = (() => {
    class Slider {

        constructor() {
            Rcom.isJqueryIncluded('Slider');
            Rcom.isSlickSliderIncluded();
        }

        sliderConfig(
            config
        ) {
            const clearConfig = Object.fromEntries(Object.entries({ ...config }).filter(([, p]) => p));
            return {
                ...clearConfig,
                centerMode: false,
                prevArrow: $(`.${clearConfig?.prevArrow}`),
                nextArrow: $(`.${clearConfig?.nextArrow}`)
            }
        }

        sliderAfterChange(totalSlides, slider, counterClass) {
            slider.on('afterChange', () => {
                this.counterHendler(totalSlides, slider, counterClass);
            });
        }

        counterHendler(totalSlides, slider, counterClass) {
            if (counterClass) {
                const current = slider.slick('slickCurrentSlide') + 1;
                $(`.${counterClass} p`).text(`${current}/${totalSlides}`);
            }
        }

        lableHendler(lableClass, totalSlides) {
            if (lableClass && totalSlides) {
                $(`.${lableClass} span`).text(`See all ${totalSlides} photos`);
            }
        };


        onOrientationChange(slider) {
            $(window).on('resize orientationchange', () => {
                slider.slick('resize');
            })
        }

        initializeSlider({
            fade,
            prevArrow,
            nextArrow,
            arrows,
            asNavFor,
            respondTo,
            adaptiveHeight,
            focusOnSelect,
            slidesToShow,
            slidesToScroll,
            sliderClass,
            counterClass,
            lableClass
        }) {
            const slider = $(`.${sliderClass}`).slick({
                ...this.sliderConfig({
                    fade,
                    arrows,
                    prevArrow,
                    nextArrow,
                    asNavFor,
                    respondTo,
                    slidesToShow,
                    adaptiveHeight,
                    focusOnSelect,
                    slidesToScroll
                })
            });
            const totalSlides = $(`.${sliderClass} .slick-slide`)?.length;
            this.sliderAfterChange(totalSlides, slider, counterClass);
            this.onOrientationChange(slider);
            this.counterHendler(totalSlides, slider, counterClass);
            this.lableHendler(lableClass, totalSlides);
            return slider;
        }

        init(config) {
            $(() => {
                if (config) {
                    this.initializeSlider(config);
                }
            });
        }
    }
    return Slider;
})();


Rcom.App.MainPage.Map = (() => {
    class Map {
        constructor(containerId) {
            Rcom.isJqueryIncluded('Map');
            Rcom.isLeafletIncluded();
            this.containerId = containerId;
        }

        initializeMap() {

            const container = L.DomUtil.get(this.containerId);
            if (!container) {
                $('.map-container').html(' ').append('<div class="map-frame rounded" id="map"></div>');
                const mymap = L.map('map').setView([51.505, -0.09], 13);

                L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=pQ4c1ggQqUOttcEslAN6', {
                    tileSize: 512,
                    zoomOffset: -1,
                    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                    crossOrigin: true
                }).addTo(mymap);

                const customMarker = new L.Icon({
                    iconUrl: '../static/images/marker-retinal.webp',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                L.marker([51.505, -0.09], { icon: customMarker }).addTo(mymap);

            }
        }

        init() {
            $(({ }) => {
                if (this.containerId) {
                    this.initializeMap();
                }
            });
        }
    }

    return Map
})();

Rcom.App.MainPage.DateRangePicker = (() => {
    class DateRangePicker {
        constructor({
            dateRangeInputId,
            applyButtonClasses,
            opens,
            isModalView
        }) {
            Rcom.isJqueryIncluded('DateRangePicker');
            Rcom.isMomentIncluded('DateRangePicker');
            Rcom.isDaterangepickerIncluded();
            this.dateRangeInputId = dateRangeInputId;
            this.applyButtonClasses = applyButtonClasses;
            this.opens = opens;
            this.isModalView = isModalView;
        }

        dateRangePickerConfig(applyButtonClasses, dates) {
            const today = new Date();
            const maxSelectableDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 500);
            return {
                minDate: new Date(),
                maxDate: maxSelectableDate,
                opens: this.opens,
                drops: "down",
                applyButtonClasses,
                startDate: dates?.start,
                endDate: dates?.end,
                autoUpdateInput: false,
                autoApply: true,
                locale: {
                    applyLabel: 'close',
                    format: "ddd, MMM D",
                    separator: " , ",
                    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    monthNames: [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                    ],
                    firstDay: 0,
                },
                maxSpan: {
                    days: 30,
                },
            }
        }

        initializeDateRangePicker(dates) {
            const start = dates?.start
            const end = dates?.end

            $(`#${this.dateRangeInputId}`).daterangepicker({
                ...this.dateRangePickerConfig(this.applyButtonClasses, { start, end })
            });

            if (dates) {
                this.handleInputChange({ start, end });
            }

            const self = this;
            $(`#${this.dateRangeInputId}`).on('apply.daterangepicker', function (ev, picker) {
                self.handleInputChange({ start: picker.startDate, end: picker.endDate });
                $(`#${self.dateRangeInputId}`).data('daterangepicker').show();
            })

            $('.applyBtn').on('click', (event) => {
                $(`#${this.dateRangeInputId}`).data('daterangepicker').hide();
                $("#datePickerModal").modal('hide');
                event.stopPropagation();
            })
        }

        handleInputChange({ start, end }) {
            if (!start.isSame(end, 'day')) {
                const startDate = start.format("ddd, MMM D");
                const endDate = end.format("ddd, MMM D");
                const nightCounter = end.diff(start, "days");
                const customValue = `${startDate} - ${endDate} (${nightCounter} nights)`;
                $(`#${this.dateRangeInputId}`).val(customValue);
                $(`#${this.dateRangeInputId}`).attr("value", JSON.stringify({ arrivalDate: start.format("MM-DD-YYYY"), departureDate: end.format("MM-DD-YYYY") }));
            }
        }

        setValue(start, end) {
            const startDate = moment(start, "MM-DD-YYYY")
            const endDate = moment(end, "MM-DD-YYYY")
            this.initializeDateRangePicker({ start: startDate, end: endDate });
        }

        dateRangePickerOnModal() {
            const dateRangeInput = $(`#${this.dateRangeInputId}`);
            $('#datePickerModal').on('shown.bs.modal', function () {
                dateRangeInput.data('daterangepicker').show();
            });
        }

        dateRangePickeronDateChange() {
            const selft = this;
            $(`#${this.dateRangeInputId}`).on('apply.daterangepicker', function (ev, picker) {
                if (selft.onDateChange) {
                    selft.onDateChange({ start: picker.startDate, end: picker.endDate });
                }
            });
        }

        onValidateDateRangePicker() {
            const dateRangeInput = $(`#date-range`);
            dateRangeInput.on('invalid', function () {
                if ($(this).is(':invalid')) {
                    const isModalView = $('#datePickerModalBtn').css('display') !== 'none';
                    if (isModalView) {
                        $("#datePickerModal").modal('show');
                    } else {
                        dateRangeInput.data('daterangepicker').show();
                    }
                }
            })
        }

        init() {
            $(() => {
                this.initializeDateRangePicker();
                this.dateRangePickeronDateChange();
                if (this.isModalView) {
                    this.dateRangePickerOnModal();
                }
                this.onValidateDateRangePicker();
            });
        }
    }

    return DateRangePicker;
})();

Rcom.App.MainPage.DropdownControl = (() => {
    class DropdownControl {
        constructor({
            dropdownId,
            dropdownItemClass
        }) {
            this.init(dropdownId, dropdownItemClass);
            this.selectValue = this.onValueChange.bind(this);
        }

        init(dropdownId, dropdownItemClass) {
            $(document).on("click", `.${dropdownItemClass}`, (event) =>
                this.handleItemClick(event, dropdownId, dropdownItemClass)
            );
            $(document).on("input", `#${dropdownId}`, (event) =>
                this.handleInputFilter(event, dropdownId, dropdownItemClass)
            );
        }

        handleItemClick(event, dropdownId, dropdownItemClass) {
            const selectedValue = $(event.target).text();
            $(`#${dropdownId}`).val(selectedValue);
            this.validationInput(selectedValue, dropdownId, dropdownItemClass);
        }

        handleInputFilter(event, dropdownId, dropdownItemClass) {
            const filterValue = $(event.target).val().toLowerCase();
            this.validationInput(filterValue, dropdownId, dropdownItemClass);

            $(`.${dropdownItemClass}`).each(function () {
                const currentItem = $(this);
                const itemText = currentItem.text().toLowerCase();
                itemText.indexOf(filterValue) > -1 ? currentItem.show() : currentItem.hide();
            });
        }

        validationInput(value, dropdownId, dropdownItemClass) {
            const items = Array.from($(`.${dropdownItemClass}`)).map((item) =>
                $(item).text().toLowerCase()
            );

            const itemsValue = Array.from($(`.${dropdownItemClass}`)).map((item) =>
                $(item).attr("value")
            );

            const indexOfValue = items.indexOf(value.toLowerCase());

            if (indexOfValue !== -1) {
                const correspondingValue = itemsValue[indexOfValue];
                $(`#${dropdownId}`).removeClass("is-invalid");
                $(`#${dropdownId}`).attr("value", correspondingValue);
                this.onValueChange(correspondingValue, dropdownId);
            } else {
                $(`#${dropdownId}`).addClass("is-invalid");
                $(`#${dropdownId}`).attr("value", 0);
            }
        }

        setValue({ value, dropdownId, dropdownItemClass }) {
            if (value !== undefined) {
                $(`#${dropdownId}`).prop("value", value);
                const newValue = typeof value === 'number' ? value.toString() : value;
                this.validationInput(newValue, dropdownId, dropdownItemClass);
            }
        }

        onValueChange(value, dropdownId) { }
    }
    return DropdownControl;
})();


Rcom.App.MainPage.RoomsDropdownControl = (() => {
    class RoomsDropdownControl extends Rcom.App.MainPage.DropdownControl {

        constructor({
            dropdownId,
            dropdownItemClass
        }) {
            super({
                dropdownId,
                dropdownItemClass
            });

            $(() => {
                if (Rcom.App.MainPage.RoomRatesForm) {
                    new Rcom.App.MainPage.RoomRatesForm();
                }
            })
        }

        removeRoomForms() {
            $("#room-forms").html('');
        }


        setValue({ value, dropdownId, dropdownItemClass }) {
            if (value) {
                const roomsCount = 1 >= value ? `${value} Room` : `${value} Rooms`;
                $(`#${dropdownId}`).prop("value", roomsCount);

                const items = Array.from($(`.${dropdownItemClass}`)).map((item) =>
                    $(item).text().toLowerCase()
                );

                const itemsValue = Array.from($(`.${dropdownItemClass}`)).map((item) =>
                    $(item).attr("value")
                );

                const indexOfValue = items.indexOf(roomsCount.toLowerCase());

                if (indexOfValue !== -1) {
                    const correspondingValue = itemsValue[indexOfValue];
                    $(`#${dropdownId}`).removeClass("is-invalid");
                    $(`#${dropdownId}`).attr("value", correspondingValue);
                } else {
                    $(`#${dropdownId}`).addClass("is-invalid");
                    $(`#${dropdownId}`).attr("value", 0);
                }
            }
        }

        onValueChange(roomNumbers) {
            $(() => {
                this.removeRoomForms();
                for (let roomNumber = 1; roomNumber <= roomNumbers; roomNumber++) {
                    const roomForm = new Rcom.App.MainPage.RoomForm(roomNumber);
                    roomForm.createRoomForm();
                }
            })
        }
    }
    return RoomsDropdownControl;
})();

Rcom.App.MainPage.QueryParamsBuilder = (() => {
    class QueryParamsBuilder {
        constructor(formData) {
            this.queryParams = [];
            this.dateRangeQueryParams(formData);
            this.roomsQueryParams(formData);
            this.visitorsQueryParams(formData);
            this.additionalQueryParams();
            this.updateUrlWithParams(this.queryParams);

        }

        dateRangeQueryParams(formData) {
            const dateRange = JSON.parse(formData["date-range"]);
            if (dateRange) {
                const arrivalDateParam = `rc-ar=${moment(dateRange.arrivalDate, "MM-DD-YYYY").format("MM-DD-YYYY")}`;
                const departureDateParam = `rc-de=${moment(dateRange.departureDate, "MM-DD-YYYY").format("MM-DD-YYYY")}`;
                this.queryParams = [...this.queryParams, arrivalDateParam, departureDateParam];
            }
        }

        roomsQueryParams(formData) {
            if (formData?.["rooms-dropdown"]) {
                const roomsParam = `rc-ro=${formData["rooms-dropdown"]}`;
                this.queryParams = [...this.queryParams, roomsParam];
            }
        }

        visitorsQueryParams(formData) {
            if (formData?.["rooms-dropdown"]) {
                for (let i = 1; i <= parseInt(formData["rooms-dropdown"]); i++) {
                    const adults = formData[`room${i}-adults-dropdown`];
                    const kidsCount = formData[`room${i}-kids-dropdown`];

                    let roomStructure = `${adults}`;

                    if (kidsCount) {
                        for (let j = 1; j <= kidsCount; j++) {
                            const kids1 = formData[`room${i}-kids${j}-dropdown`];
                            roomStructure += `-${kids1}`;
                        }
                    }

                    const roomStructureParam = `rc-rm=${roomStructure}`;
                    this.queryParams = [...this.queryParams, roomStructureParam];
                }
            }
        }

        additionalQueryParams() {
            if (Object.keys(Rcom.QSParameters).length !== 0) {
                const queryParamsArray = Object.entries(Rcom.QSParameters).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                this.queryParams = [...this.queryParams, ...queryParamsArray];
            }
        }

        updateUrlWithParams(queryParams) {
            const currentUrl = window.location.href;
            const updatedUrl = currentUrl.split('?')[0] + '?' + queryParams.join('&');
            this.updateBrowserHistory(updatedUrl);
            const roomsData = new Rcom.App.MainPage.ParseUrlParameters(new URL(updatedUrl));
            if (roomsData) {
                this.updateRoomCards()
                this.updateRoomTypesAndRates(roomsData);
            }
        }

        updateRoomCards() {
            if (Rcom.App.MainPage.RoomCardsInitialInstance) {
                Rcom.App.MainPage.RoomCardsInitialInstance = null;
            }

            Rcom.App.MainPage.RoomCardsInstance = new Rcom.App.MainPage.RoomCards().init('room-cards-container');
        }

        updateRoomTypesAndRates(roomsData) {
            new Rcom.App.MainPage.RoomTypesAndRates({
                roomsData,
                displayFlag: true,
            });
        }


        updateBrowserHistory(url) {
            window.history.replaceState({}, document.title, url);
            window.history.pushState({}, '', url);
        }

    }
    return QueryParamsBuilder;
})();


Rcom.App.MainPage.ParseUrlParameters = (() => {
    class ParseUrlParameters {
        constructor(url) {
            // if (this.validateQueryParameters(url)) {
            return this.parseUrlParameters(url);
            // }
        }

        parseUrlParameters(url) {
            const params = new URLSearchParams(url.search || url.hash?.substring(1)?.split('?')?.[1]);

            const roomParams = params.getAll('rc-rm');

            let parsedUrlParameters = {
                startDate: params.get('rc-ar'),
                endDate: params.get('rc-de'),
                roomsDropdown: Number(params.get('rc-ro')),
                rooms: []
            };
            for (let i = 0; i <= parseInt(parsedUrlParameters.roomsDropdown); i++) {
                let room;
                const params = roomParams?.[i]?.split('-');
                const kids = params?.slice(1);

                if (params?.length) {
                    room = {}
                }

                if (kids?.length) {
                    room = { ...room, kids: Number(kids?.length), kidsAge: kids.map(kid => Number(kid)) };
                }

                if (params?.length) {
                    room = { ...room, adults: Number(params[0]) }
                };

                if (room) {
                    parsedUrlParameters.rooms[i] = room;
                }
            }
            return parsedUrlParameters;

        }

        validateQueryParameters(url) {

            const minAdults = 1;
            const minKidsAge = 0;

            const maxAdults = 4;
            const maxKidsAge = 16;

            const dateFormatRegex = /^\d{2}-\d{2}-\d{4}$/;
            const positiveIntegerRegex = /^[1-16]\d*$/;

            const queryParams = new URLSearchParams(url.search || url.hash?.substring(1)?.split('?')?.[1]);

            const rcAr = queryParams.get('rc-ar');
            if (!dateFormatRegex.test(rcAr)) {
                return false;
            }

            const rcDe = queryParams.get('rc-de');
            if (!dateFormatRegex.test(rcDe)) {
                return false;
            }

            const rcRo = queryParams.get('rc-ro');
            if (!positiveIntegerRegex.test(rcRo) || parseInt(rcRo) < 1 || parseInt(rcRo) > 9) {
                return false;
            }

            const rcRmValues = queryParams.getAll('rc-rm');
            if (
                rcRmValues.length === 0 ||
                rcRmValues.length > 5 ||
                !rcRmValues.every(value => {
                    const [first, ...rest] = value.split('-').map(Number);
                    return (
                        positiveIntegerRegex.test(first) &&
                        first >= minAdults &&
                        first <= maxAdults &&
                        rest.every(num => positiveIntegerRegex.test(num) && num >= minKidsAge && num <= maxKidsAge)
                    );
                })
            ) {
                return false;
            }

            return true;
        }
    }

    return ParseUrlParameters;
})();

Rcom.App.MainPage.OnChangeURLParameters = (() => {
    class OnChangeURLParameters {

        constructor() { }

        initializeUrl(url, roomsDropdownControl, dateRangePicker) {
            if (OnChangeURLParameters.areSearchParametersPresent(url)) {
                const roomsData = new Rcom.App.MainPage.ParseUrlParameters(new URL(url.href));
                if (roomsData) {
                    this.updateRoomTypesAndRateByUrlParameters(roomsData, true);
                    this.creteRoomRatesFormByUrlParameters(roomsData, roomsDropdownControl, dateRangePicker);
                }
            } else {
                this.updateRoomTypesAndRateByUrlParameters(false, false);
                roomsDropdownControl.setValue({
                    value: 1,
                    dropdownId: 'rooms-dropdown',
                    dropdownItemClass: 'custom-rooms-dropdown-item',
                })
                roomsDropdownControl.onValueChange(1)
            }
        }

        static areSearchParametersPresent(url) {
            const params = new URLSearchParams(url.search || url.hash?.substring(1)?.split('?')?.[1]);
            return (params.has('rc-ar') && params.has('rc-de') && params.has('rc-ro') && params.has('rc-rm'))
        }

        updateRoomTypesAndRateByUrlParameters(roomsData, displayFlag) {
            new Rcom.App.MainPage.RoomTypesAndRates({
                roomsData,
                displayFlag,
            });

        }

        creteRoomRatesFormByUrlParameters(roomsData, roomsDropdownControl, dateRangePicker) {
            if (roomsData?.roomsDropdown) {
                dateRangePicker.setValue(roomsData.startDate, roomsData.endDate);
                roomsDropdownControl.setValue({
                    value: roomsData.roomsDropdown,
                    dropdownId: 'rooms-dropdown',
                    dropdownItemClass: 'custom-rooms-dropdown-item',
                })
                for (let roomNumber = 1; roomNumber <= roomsData.roomsDropdown; roomNumber++) {
                    const roomForm = new Rcom.App.MainPage.RoomForm(roomNumber);
                    roomForm.createRoomForm({ ...roomsData, room: roomsData?.rooms[roomNumber - 1] });
                }
            }
        }

        init({
            url,
            roomsDropdownControl,
            dateRangePicker
        }) {
            $(() => {
                if (url && roomsDropdownControl && dateRangePicker) {
                    this.initializeUrl(url, roomsDropdownControl, dateRangePicker);
                }
            })
        }
    }

    return OnChangeURLParameters;
})();


Rcom.App.MainPage.BrowserHistoryNavigation = (() => {
    class BrowserHistoryNavigation {
        constructor(url) {
            this.popstateListener(url);
        }

        popstateListener(url) {
            window.addEventListener('popstate', (event) => {
                if (event.state) {
                    this.handleStateChange(url);
                }
            });
        }

        handleStateChange(url) {
            const roomsData = new Rcom.App.MainPage.ParseUrlParameters(new URL(url.href));
            if (roomsData) {
                new Rcom.App.MainPage.RoomTypesAndRates({
                    roomsData,
                    displayFlag: true,
                });
            }
        }
    }

    return BrowserHistoryNavigation
})();


Rcom.App.MainPage.RoomTypesAndRates = (() => {
    class RoomTypesAndRates {
        constructor({
            roomsData,
            displayFlag
        }) {
            $(() => {
                const containerId = 'rooms-types-and-rates-container';
                this.setRoomsDataValues(containerId, roomsData);
                this.seeNewDatesHandler(containerId);
                this.displayRoomTypesAndRates(displayFlag, containerId);
            })
        }

        setRoomsDataValues(containerId, roomsData) {
            if (!roomsData) {
                return false;
            }
            const startDate = this.formData(roomsData.startDate);
            const endDate = this.formData(roomsData.endDate);
            const totalRooms = roomsData?.roomsDropdown || 0;

            $(`#${containerId} #startDate`).text(startDate);
            $(`#${containerId} #endDate`).text(endDate);
            $(`#${containerId} #rooms`).text(totalRooms);

            let totalAdults = 0;
            let totalKids = 0;

            roomsData.rooms.forEach((room, index) => {
                const roomNumber = index + 1;

                const adults = room?.adults || 0;
                const kids = room?.kids || 0;
                const kidsAge = room?.kidsAge || [];

                totalAdults += adults;
                totalKids += kids;

                $(`#${containerId} #room${roomNumber}-adults`).text(adults);
                $(`#${containerId} #room${roomNumber}-kids`).text(kids);

                if (kidsAge.length > 0) {
                    $(`#${containerId} #room${roomNumber}-kidsAge`).text(kidsAge.join(', '));
                } else {
                    $(`#${containerId} #room${roomNumber}-kidsAge`).text('N/A');
                }
            });

            $(`#${containerId} #adults`).text(totalAdults);
            $(`#${containerId} #kids`).text(totalKids);
        }

        formData(dateString) {
            const date = moment(dateString, 'MM-DD-YYYY');
            return date.format('dddd, MM/DD/YYYY');
        }

        displayRoomTypesAndRates(displayFlag, containerId) {
            displayFlag ? $(`#${containerId}`).show() : $(`#${containerId}`).hide();
        }

        seeNewDatesHandler(containerId) {
            $(`#${containerId} #see-new-dates-btn`).on('click', () => {
                Rcom.App.MainPage.RommRates.displayRoomRates({
                    displayFlag: true
                });
            });
        }
    }

    return RoomTypesAndRates;
})();


Rcom.App.MainPage.RoomRatesForm = (() => {
    class RoomRatesForm {

        constructor() {
            this.onSubmissionListener();
        }

        onSubmissionListener() {
            $('#room-rates-form').on('submit', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const isValid = this.validateForm();
                if (!isValid) {
                    this.addWasValidatedClass();
                } else {
                    const formValues = this.getFormValues();
                    this.processFormSubmission(formValues);
                }
            });
        }

        validateForm() {
            let isValid = true;
            $('#room-rates-form').each(function () {
                if (!this.checkValidity()) {
                    isValid = false;
                }
            });
            return isValid;
        }

        addWasValidatedClass() {
            $('#room-rates-form').addClass('was-validated');
        }

        getFormValues() {
            const formValues = {};
            $('#room-rates-form :input').each(function () {
                const input = $(this);
                const id = input.attr('id');
                const value = input.attr('value');
                formValues[id] = value;
            });
            return formValues
        }

        processFormSubmission(formValues) {
            new Rcom.App.MainPage.QueryParamsBuilder(formValues);
            Rcom.App.MainPage.RommRates.displayRoomRates({
                displayFlag: false
            });
        }
    }
    return RoomRatesForm;
})();

Rcom.App.MainPage.RoomForm = (() => {
    class RoomForm {
        constructor(roomNumber) {
            this.roomNumber = roomNumber;
            this.roomFormContainer = $("<div>").addClass("d-flex column-gap-5");
            this.roomFormContainerLabel = $("<div>")
                .addClass("align-self-md-center")
                .html(`<p class="text-uppercase text-light fw-bold text-nowrap">Room ${roomNumber}</p>`);
            this.roomForm = $("<div>").addClass("d-flex column-gap-5");

            this.dropdownFirstGroupContainer = $("<div>").addClass("d-flex column-gap-3");
            this.dropdownSecondGroupContainer = $("<div>").addClass("d-flex column-gap-3 age-inputs").attr('id', `age-inputs-${roomNumber}`);
        }

        createDropdown({
            placeholder,
            id,
            validationText,
            dropdownHeaderText,
            dropdownValues,
            required
        }) {
            const inputContainer = $("<div>");
            const labelElement = $("<label>")
                .attr("for", id)
                .addClass("form-label text-uppercase text-light fw-normal")
                .text(placeholder);

            const dropdown = $("<div>").addClass("dropdown").css({ 'max-width': '6.375rem' });
            const input = $("<input>")
                .attr({
                    id,
                    required,
                    placeholder,
                    type: 'text',
                    autocomplete: 'off',
                    'icon-right': 'icon-chevron-down',
                    'data-bs-toggle': 'dropdown',
                })
                .addClass("form-control form-control-md");

            const invalidFeedback = $("<div>")
                .addClass("invalid-feedback")
                .text(`${validationText}`);

            const dropdownMenu = $("<ul>").addClass("dropdown-menu");
            const dropdownHeader = $("<li>").addClass("dropdown-header").text(`${dropdownHeaderText}`);

            dropdownMenu.append(dropdownHeader);

            dropdownValues.forEach(({ name, value }) => {
                const dropdownItem = $("<li>")
                    .addClass(`dropdown-item ${id}-item`)
                    .attr("value", value)
                    .text(name);
                dropdownMenu.append(dropdownItem);
            });

            dropdown.append(input, invalidFeedback, dropdownMenu);
            inputContainer.append(labelElement, dropdown);

            return inputContainer;
        }

        createRoomForm(formData) {
            this.dropdownFirstGroupContainer.append(this.createAdultsDropdown(), this.createKidsDropdown());

            this.roomForm.append(this.dropdownFirstGroupContainer, this.dropdownSecondGroupContainer);

            this.roomFormContainer.append(this.roomFormContainerLabel, this.roomForm);

            $("#room-forms").append(this.roomFormContainer).ready(() => {
                this.createAdultsDropdownControl(formData);
                this.createKidsAgeDropdownsOnchage(formData);
                this.createKidsAgeDropdownsOnFormData(formData);
            })
        }

        createAdultsDropdownControl(formData) {
            const dropdownId = `room${this.roomNumber}-adults-dropdown`;
            const dropdownItemClass = `room${this.roomNumber}-adults-dropdown-item`;

            const adultsDropdownControl = new Rcom.App.MainPage.DropdownControl({
                dropdownId,
                dropdownItemClass
            });

            if (formData?.room?.adults) {
                adultsDropdownControl.setValue({
                    value: formData.room.adults,
                    dropdownId,
                    dropdownItemClass
                });
            } else {
                adultsDropdownControl.setValue({
                    value: 2,
                    dropdownId,
                    dropdownItemClass
                });
            }

            return adultsDropdownControl;
        }

        createKidsDropdownControl(formData) {
            const dropdownId = `room${this.roomNumber}-kids-dropdown`;
            const dropdownItemClass = `room${this.roomNumber}-kids-dropdown-item`;

            const kidsDropdownControl = new Rcom.App.MainPage.DropdownControl({
                dropdownId,
                dropdownItemClass
            });

            if (formData?.room?.kids) {
                kidsDropdownControl.setValue({
                    value: formData.room.kids,
                    dropdownId,
                    dropdownItemClass
                });
            } else {
                kidsDropdownControl.setValue({
                    value: 0,
                    dropdownId,
                    dropdownItemClass
                });
            }

            return kidsDropdownControl;
        }

        createKidsAgeDropdownControls(kidsNumbers, formData) {
            for (let i = 1; i <= kidsNumbers; i++) {
                const dropdownId = `room${this.roomNumber}-kids${i}-dropdown`;
                const dropdownItemClass = `room${this.roomNumber}-kids${i}-dropdown-item`;

                const ageDropdownControls = new Rcom.App.MainPage.DropdownControl({
                    dropdownId,
                    dropdownItemClass
                });

                if (formData?.room?.kidsAge?.[i - 1]) {
                    ageDropdownControls.setValue({
                        value: formData.room.kidsAge[i - 1],
                        dropdownId,
                        dropdownItemClass
                    })
                } else {
                    ageDropdownControls.setValue({
                        value: 0,
                        dropdownId,
                        dropdownItemClass
                    })
                }
            }
        }


        createAdultsDropdown() {
            const adultsDropdownValue = [
                { name: '1', value: 1 },
                { name: '2', value: 2 },
                { name: '3', value: 3 },
                { name: '4', value: 4 }
            ];
            return this.createDropdown({
                placeholder: 'Adults',
                id: `room${this.roomNumber}-adults-dropdown`,
                validationText: 'Incorrect number of adults',
                dropdownHeaderText: 'Choose number of adults',
                dropdownValues: adultsDropdownValue,
                required: true
            });
        }

        createKidsDropdown() {
            const kidsDropdownValues = [
                { name: '0', value: 0 },
                { name: '1', value: 1 },
                { name: '2', value: 2 },
                { name: '3', value: 3 },
                { name: '4', value: 4 }
            ];
            return this.createDropdown({
                placeholder: 'Kids',
                id: `room${this.roomNumber}-kids-dropdown`,
                validationText: 'Incorrect number of kids',
                dropdownHeaderText: 'Choose number of kids',
                dropdownValues: kidsDropdownValues,
                required: false
            });
        }

        createKidsAgeDropdowns(kidsNumbers) {
            for (let kidsNumber = 1; kidsNumber <= kidsNumbers; kidsNumber++) {
                const kidsAgeDropdownValue = [
                    { name: '0', value: 0 },
                    { name: '1', value: 1 },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 },
                    { name: '4', value: 4 },
                    { name: '5', value: 5 },
                    { name: '6', value: 6 },
                    { name: '7', value: 7 },
                    { name: '8', value: 8 },
                    { name: '9', value: 9 },
                    { name: '10', value: 10 },
                    { name: '11', value: 11 },
                    { name: '12', value: 12 },
                    { name: '13', value: 13 },
                    { name: '14', value: 14 },
                    { name: '15', value: 15 },
                    { name: '16', value: 16 },
                ];
                const kidsAgeInput = this.createDropdown({
                    placeholder: 'Age',
                    id: `room${this.roomNumber}-kids${kidsNumber}-dropdown`,
                    validationText: 'Incorrect age',
                    dropdownHeaderText: 'Choose kid age',
                    dropdownValues: kidsAgeDropdownValue,
                    required: false
                });

                this.dropdownSecondGroupContainer.append(kidsAgeInput);
            }
        }

        createKidsAgeDropdownsOnchage(formData) {
            this.createKidsDropdownControl(formData).onValueChange = (kidsNumbers) => {
                this.removeAgeInputs();
                this.createKidsAgeDropdowns(kidsNumbers)
                this.createKidsAgeDropdownControls(kidsNumbers);

            };
        }

        createKidsAgeDropdownsOnFormData(formData) {
            if (formData?.room?.kids && formData?.room?.kidsAge?.length) {
                const kidsNumbers = formData.room.kids;
                this.createKidsAgeDropdowns(kidsNumbers);
                this.createKidsAgeDropdownControls(kidsNumbers, formData);
            }
        }

        removeAgeInputs() {
            $(`#age-inputs-${this.roomNumber}`).html('');
        }
    }
    return RoomForm;
})();

Rcom.App.MainPage.PopUpCloseButton = (() => {
    function initializeCloseButton() {
        $(".close-sign").on('click', function () {
            $(".special-rates-container").addClass("special-rates-container-close");
        });
    }

    return {
        init: () => { $(() => { initializeCloseButton() }) },
    };
})();

Rcom.App.MainPage.ReviewTruncation = (() => {
    class ReviewTruncation {
        constructor({ truncateReviewId, reviewId, toggleReviewButtonId, maxLength }) {
            Rcom.isJqueryIncluded('ReviewTruncation');

            this.truncateReviewId = truncateReviewId;
            this.reviewId = reviewId;
            this.toggleReviewButtonId = toggleReviewButtonId;
            this.maxLength = maxLength;

            this.text = $(`#${this.truncateReviewId}`).text();
            this.truncatedText = this.text?.substring(0, this.maxLength) + '...';

            this.reviewHandler(maxLength);
        }

        truncateText() {
            if (this.text?.length > this.maxLength) {
                $(`#${this.truncateReviewId}`).text(this.truncatedText);
                const restOfText = this.text?.substring(this.maxLength);
                $(`#${this.reviewId}`).text(restOfText);
            }
        }

        reviewHandler(maxLength) {
            const originalText = this.text?.substring(0, maxLength);
            $(`#${this.toggleReviewButtonId}`).on('click', () => {
                if ($(`#${this.toggleReviewButtonId}`).hasClass('collapsed')) {
                    $(`#${this.truncateReviewId}`).text(this.truncatedText);
                } else {
                    $(`#${this.truncateReviewId}`).text(originalText);
                }
            });
        }
    }
    return ReviewTruncation;
})();

Rcom.App.MainPage.Reviews = (() => {
    class Reviews {
        constructor() {
            Rcom.isJqueryIncluded('Reviews');
        }

        truncationReviews(reviewsContainerId) {
            $(function () {
                const reviewsLength = $(`#${reviewsContainerId} li`)?.length;
                if (reviewsLength) {
                    for (let i = 1; i <= reviewsLength; i++) {
                        const truncateReviewId = `truncateReview-${i}`;
                        const reviewId = `review-${i}`;
                        const toggleReviewButtonId = `toggleReviewButton-${i}`;
                        $(`#${reviewsContainerId} li:nth-child(${i}) #truncateReview`).attr('id', truncateReviewId);
                        $(`#${reviewsContainerId} li:nth-child(${i}) #review`).attr('id', reviewId);
                        $(`#${reviewsContainerId} li:nth-child(${i}) #toggleReviewButton`).attr({
                            'id': toggleReviewButtonId,
                            'data-bs-target': `#${reviewId}`
                        });
                        if (Rcom.App.MainPage.ReviewTruncation) {
                            new Rcom.App.MainPage.ReviewTruncation({
                                truncateReviewId,
                                reviewId,
                                toggleReviewButtonId,
                                maxLength: 294
                            }).truncateText();
                        }
                    }
                }
            });
        }

        init(reviewsContainerId) {
            $(() => {
                this.truncationReviews(reviewsContainerId);
            })
        }
    }

    return Reviews;
})();

Rcom.App.MainPage.RoomCardsHolder = null;
Rcom.App.MainPage.RoomCards = (() => {
    class RoomCards {
        constructor() {
            Rcom.isJqueryIncluded('RoomCards');
        }

        initRoomCards(roomCardsContainerId) {
            this.displayRoomCards(roomCardsContainerId);
            const roomCardsLength = $(`#${roomCardsContainerId} .room-card-view`)?.length;
            if (roomCardsLength) {
                for (let i = 1; i <= roomCardsLength; i++) {
                    this.initDropdownControlForRoomCard(roomCardsContainerId, i);
                    this.initSliderForRoomCard(roomCardsContainerId, i);
                }
            }
        }

        displayRoomCards(roomCardsContainerId) {
            const roomCardBeforeSearch = $(`#${roomCardsContainerId} .before-search-view`);
            const roomCardPriceView = $(`#${roomCardsContainerId} .price-view`);
            if (Rcom.App.MainPage?.OnChangeURLParameters?.areSearchParametersPresent(window.location)) {
                roomCardBeforeSearch.detach();
                $(`#${roomCardsContainerId}`).append(Rcom.App.MainPage.RoomCardsHolder);
            } else {
                Rcom.App.MainPage.RoomCardsHolder = roomCardPriceView.detach();
            }
        }

        initDropdownControlForRoomCard(roomCardsContainerId, index) {
            const roomDetailsContentId = `roomDetailsConten-${index}`;
            const toggleRoomDetailsButtonId = `toggleRoomDetailsButton-${index}`;
            $(`#${roomCardsContainerId} li:nth-child(${index}) #extended-content-collapse`).attr('id', roomDetailsContentId);
            $(`#${roomCardsContainerId} li:nth-child(${index}) #toggleRoomDetailsButton`).attr({
                'id': toggleRoomDetailsButtonId,
                'data-bs-target': `#${roomDetailsContentId}`
            });
        }

        initSliderForRoomCard(roomCardsContainerId, index) {
            const sliderClass = `custom-slider_room_for-${index}`;
            const prevArrow = `custom-slider_room_control-prev-${index}`;
            const nextArrow = `custom-slider_room_control-next-${index}`;
            const counterClass = `custom-slider_room_counter-${index}`;
            $(`#${roomCardsContainerId} li:nth-child(${index}) .custom-slider_room_for`).addClass(sliderClass);
            $(`#${roomCardsContainerId} li:nth-child(${index}) .custom-slider_room_control-prev`).addClass(prevArrow);
            $(`#${roomCardsContainerId} li:nth-child(${index}) .custom-slider_room_control-next`).addClass(nextArrow);
            $(`#${roomCardsContainerId} li:nth-child(${index}) .custom-slider_room_counter`).addClass(counterClass);
            if (Rcom.App.MainPage.Slider) {
                new Rcom.App.MainPage.Slider().init({
                    fade: true,
                    slidesToShow: 1,
                    prevArrow,
                    nextArrow,
                    arrows: true,
                    asNavFor: false,
                    respondTo: sliderClass,
                    adaptiveHeight: true,
                    focusOnSelect: false,
                    sliderClass,
                    counterClass
                });
            }
        }

        init(roomCardsContainerId) {
            $(() => { this.initRoomCards(roomCardsContainerId) })
        }
    }

    return RoomCards;
})();

Rcom.App.MainPage.RommRates = (() => {
    class RommRates {
        static displayRoomRates({ displayFlag }) {
            $(() => {
                const roomRatesContainerId = $('#room-rates-container');
                displayFlag ? roomRatesContainerId.show() : roomRatesContainerId.hide();
            });
        }
    }
    return RommRates;
})();


Rcom.App.MainPage.ScrollTracking = (() => {
    function initializeScrollTracking() {
        $(window).on('scroll', function () {

            //mobile navbar functionality
            $('#room-rates, #about-hotel, #hotel-location, #reviews').each(function () {
                if ($(window).scrollTop() > $(this).offset().top - 10) {
                    const blockId = $(this).attr('id');
                    $('#nav-mobile .nav-link').removeClass('active');
                    $('#nav-mobile a.nav-link[href^="#' + blockId + '"]').addClass('active');
                }
            });

            //mobile scroll-up icon functionality
            if ($(this).scrollTop() > 500 && $(this).width() < 768) {
                $('.scroll-up-mobile').fadeIn();
            } else {
                $('.scroll-up-mobile').fadeOut();
            }

            //mobile special rates functionality
            let titleTop = $("#room-rates-title").offset().top - $(document).scrollTop();
            let specialRates = $(".special-rates-container");
            let scrolled = $(this).scrollTop() > 500;

            if (Rcom.App.MainPage.OnChangeURLParameters.areSearchParametersPresent(window.location)) {
                if (Rcom.Constants.noAvailability) {
                    scrolled ? specialRates.removeClass("d-none") : specialRates.addClass("d-none");
                } else {
                    titleTop <= 0 ? specialRates.removeClass("d-none") : specialRates.addClass("d-none");
                }
            } else {
                scrolled ? specialRates.removeClass("d-none") : specialRates.addClass("d-none")
            }
        });
    }

    return {
        init: () => { $(() => { initializeScrollTracking() }) },
    };
})();


Rcom.App.MainPage.ScrollUpIcon = (() => {
    function initializeScrollUpIcon() {
        $('.scroll-up-mobile').on('click', function () {
            $('html, body').animate({ scrollTop: 0 });
            return false;
        });
    }

    return {
        init: () => { $(() => { initializeScrollUpIcon() }) },
    };
})();


Rcom.App.MainPage.TopReserveButton = (() => {
    function initializeTopReserveButton() {
        const beforeSearch = !Rcom.App.MainPage.OnChangeURLParameters.areSearchParametersPresent(window.location);

        if (Rcom.Constants.noAvailability || beforeSearch) {
            if ($(window).width() > 768) {
                $('#top-reserve-btn').on('click', function () {
                    $("html").animate({
                        scrollTop: $("#room-rates").offset().top
                    }, 0)

                    function dateRangeClick() {
                        if ($("#room-rates-container").not().css('display') !== 'none') {
                            $("#date-range").trigger("click");
                        }
                    }

                    setTimeout(dateRangeClick, 800);
                })
            } else {
                $('#top-reserve-btn-mobile').on('click', function () {
                    $("html").animate({
                        scrollTop: $("#room-rates").offset().top
                    }, 0)

                    function dateRangeModalClick() {
                        if ($("#room-rates-container").not().css('display') !== 'none') {
                            $("#datePickerModal").modal("show");
                        }
                    }

                    setTimeout(dateRangeModalClick, 800);
                });
            };
        };
    };

    return {
        init: () => { $(() => { initializeTopReserveButton() }) },
    };
})();


Rcom.App.MainPage.CheckRoomsAndRatesButton = (() => {
    function initializeCheckRoomsAndRatesButton() {
        const beforeSearch = !Rcom.App.MainPage.OnChangeURLParameters.areSearchParametersPresent(window.location);

        $('#checkRoomsAndRatesButton').on('click', function () {
            if (Rcom.Constants.noAvailability || beforeSearch) {
                $("html").animate({
                    scrollTop: $("#room-rates").offset().top
                }, 0)

                function dateRangeClick() {
                    if ($("#room-rates-container").not().css('display') !== 'none') {
                        $("#date-range").trigger("click");
                    }
                }

                setTimeout(dateRangeClick, 800);
            } else {
                $("html").animate({
                    scrollTop: $("#room-rates-title").offset().top - 55
                });
            }
        })
    };

    return {
        init: () => { $(() => { initializeCheckRoomsAndRatesButton() }) },
    };
})();


Rcom.App.MainPage.CheckRatesButton = (() => {
    function initializeCheckRatesButton() {
        const beforeSearch = !Rcom.App.MainPage.OnChangeURLParameters.areSearchParametersPresent(window.location);

        if (beforeSearch) {
            $('#checkRatesButton').on('click', function () {
                if ($("#date-range").val()) {
                    $("#checkRoomRatesButton").trigger("click");
                } else {
                    $("html").animate({
                        scrollTop: $("#room-rates").offset().top
                    }, 0)

                    if ($(window).width() > 768) {
                        function dateRangeClick() {
                            $("#date-range").trigger("click");
                        }

                        setTimeout(dateRangeClick, 800);
                    } else {
                        function dateRangeModalClick() {
                            $("#datePickerModal").modal("show");
                        }

                        setTimeout(dateRangeModalClick, 800);
                    }
                }
            });
        };
    };

    return {
        init: () => { $(() => { initializeCheckRatesButton() }) },
    };
})();


Rcom.App.MainPage.AutoScroll = (() => {
    function initializeAutoScroll() {
        if (Rcom.App.MainPage.OnChangeURLParameters.areSearchParametersPresent(window.location)) {
            if (Rcom.Constants.noAvailability) {
                $("html").animate({
                    scrollTop: $("#room-rates").offset().top
                });
            } else {
                $("html").animate({
                    scrollTop: $("#room-rates-title").offset().top - 55
                });
            }
        }
    }

    return {
        init: () => { $(() => { initializeAutoScroll() }) },
    };
})();


Rcom.App.MainPage.ImagePlaceholder = (() => {
    class ImagePlaceholder {
        constructor() {
            Rcom.isJqueryIncluded('ImagePlaceholder');
        }

        checkImagesExist(sliderSelector) {
            let imagesExist = false;

            $(sliderSelector).find('img').each(function () {
                if (this.complete && this.naturalHeight !== 0) {
                    imagesExist = true;
                    return false;
                }
            });

            return imagesExist;
        }

        toggleSliderOrPlaceholder(sliderSelector, placeholderSelector) {
            const imagesExist = this.checkImagesExist(sliderSelector);
            if (imagesExist) {
                $(sliderSelector).show();
            } else {
                $(sliderSelector).hide();
                $(placeholderSelector).attr('style', 'display: flex')
            }
        }

        init({ sliderSelector, placeholderSelector }) {
            $(() => {
                if (sliderSelector, placeholderSelector) {
                    this.toggleSliderOrPlaceholder(sliderSelector, placeholderSelector);
                }
            });
        }
    }
    return ImagePlaceholder;
})();

Rcom.App.MainPage.ModalSlider = (() => {
    class ModalSlider {
        constructor() {
            this.modalSlider = null;
            this.modalSliderNavigation = null;
            Rcom.isJqueryIncluded('ModalSlider');
        }

        initializeSlider() {
            this.modalSlider = new Rcom.App.MainPage.Slider().init({
                fade: true,
                slidesToShow: 1,
                prevArrow: 'custom-slider_modal_control-prev',
                nextArrow: 'custom-slider_modal_control-next',
                arrows: true,
                respondTo: false,
                adaptiveHeight: false,
                focusOnSelect: true,
                sliderClass: 'custom-slider_modal_for',
                counterClass: 'custom-slider_modal_counter',
                lableClass: false,
                slidesToScroll: 1,
            });

            this.modalSliderNavigation = new Rcom.App.MainPage.Slider().init({
                fade: false,
                slidesToShow: 5,
                prevArrow: false,
                nextArrow: false,
                respondTo: false,
                adaptiveHeight: false,
                focusOnSelect: true,
                sliderClass: 'custom-slider_modal_nav',
                counterClass: false,
                lableClass: false,
                slidesToScroll: 5,
            });

            $('.custom-slider_modal_nav').on('click', '.slick-slide', (event) => {
                const slickIndex = $(event.currentTarget).data('slickIndex');
                $('.custom-slider_modal_for').slick('slickGoTo', slickIndex);
            });
        }

        destroySlider() {
            if (this.modalSlider) {
                $('.custom-slider_modal_for').slick('unslick');
            }
            if (this.modalSliderNavigation) {
                $('.custom-slider_modal_nav').slick('unslick');
            }
        }

        init() {
            $(() => {
                $('#modallGallery').on('shown.bs.modal', () => {
                    this.initializeSlider();
                });

                $('#modallGallery').on('hidden.bs.modal', () => {
                    this.destroySlider();
                });
            });
        }
    }

    return ModalSlider;
})();


Rcom.App.MainPage.DateRangePickerInstance = new Rcom.App.MainPage.DateRangePicker({
    dateRangeInputId: 'date-range',
    applyButtonClasses: 'applyBtnCutom',
    opens: 'right',
    isModalView: false
})

Rcom.App.MainPage.DateRangePickerInstance.init();

Rcom.App.MainPage.DateRangePickerMobileInstance = new Rcom.App.MainPage.DateRangePicker({
    dateRangeInputId: 'date-range-mobile',
    applyButtonClasses: 'applyBtnCutomMobile',
    opens: 'center',
    isModalView: true
})

Rcom.App.MainPage.DateRangePickerMobileInstance.init();

Rcom.App.MainPage.DateRangePickerMobileInstance.onDateChange = (dates) => {
    Rcom.App.MainPage.DateRangePickerInstance.initializeDateRangePicker(dates);
};

Rcom.App.MainPage.DateRangePickerInstance.onDateChange = (dates) => {
    Rcom.App.MainPage.DateRangePickerMobileInstance.initializeDateRangePicker(dates);
};

Rcom.App.MainPage.RoomsDropdownControlInstance = new Rcom.App.MainPage.RoomsDropdownControl({
    dropdownId: 'rooms-dropdown',
    dropdownItemClass: 'custom-rooms-dropdown-item',
});

new Rcom.App.MainPage.Reviews().init('reviews-container');

Rcom.App.MainPage.RoomCardsInitialInstance = new Rcom.App.MainPage.RoomCards().init('room-cards-container');

new Rcom.App.MainPage.Map('map').init();

new Rcom.App.MainPage.Slider().init({
    fade: true,
    slidesToShow: 1,
    prevArrow: 'custom-slider_preview_control-prev',
    nextArrow: 'custom-slider_preview_control-next',
    arrows: true,
    asNavFor: '.custom-slider_preview_nav',
    respondTo: 'slider-col',
    adaptiveHeight: true,
    focusOnSelect: false,
    sliderClass: 'custom-slider_preview_for',
    counterClass: 'custom-slider_preview_counter',
    lableClass: 'custom-slider_preview_lable',
    slidesToScroll: 1,
});

new Rcom.App.MainPage.Slider().init({
    fade: false,
    slidesToShow: 4,
    prevArrow: false,
    nextArrow: false,
    asNavFor: '.custom-slider_preview_for',
    respondTo: false,
    adaptiveHeight: false,
    focusOnSelect: true,
    sliderClass: 'custom-slider_preview_nav',
    counterClass: false,
    lableClass: false,
    slidesToScroll: 1,
});

new Rcom.App.MainPage.ModalSlider().init();

new Rcom.App.MainPage.OnChangeURLParameters().init({
    url: window.location,
    roomsDropdownControl: Rcom.App.MainPage.RoomsDropdownControlInstance,
    dateRangePicker: Rcom.App.MainPage.DateRangePickerInstance
});

new Rcom.App.MainPage.BrowserHistoryNavigation(window.location);


new Rcom.App.MainPage.ImagePlaceholder().init({
    sliderSelector: '.custom-slider_preview_for',
    placeholderSelector: '#no-image-placeholder'
})

Rcom.App.MainPage.PopUpCloseButton.init();

Rcom.App.MainPage.ScrollUpIcon.init();

Rcom.App.MainPage.ScrollTracking.init();

Rcom.App.MainPage.AutoScroll.init();

Rcom.App.MainPage.TopReserveButton.init();

Rcom.App.MainPage.CheckRatesButton.init();

Rcom.App.MainPage.CheckRoomsAndRatesButton.init();
