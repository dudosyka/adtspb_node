const User = require('../../Entity/User');
const UserExtraData = require('../../Entity/UserExtraData');
const Association = require('../../Entity/Association');

let Pdf = function (proposal = null, options = { format: 'A4' }, file = "") {
    this.proposal = proposal;
    this.options = options;
    this.file = file;
}

Pdf.prototype.proposal = null;
Pdf.prototype.options = { format: 'A4' };
Pdf.prototype.date = new Date();
Pdf.prototype.file = "";
Pdf.prototype.generator = require('html-pdf-node');

Pdf.prototype.generate = async function () {
    return await this.generator.generatePdf(this.file, this.options).then(buffer => {
        return buffer;
    });
}

Pdf.prototype.getFullDate = function () {
    const month = this.date.getMonth() + 1 > 9 ? this.date.getMonth() + 1 : "0" + (this.date.getMonth() + 1);
    const day = this.date.getDate() > 9 ? this.date.getDate() : "0" + this.date.getDate();
    return this.date.getFullYear() + "-" + month + "-" + day;
}

Pdf.prototype.generateProposal = async function (child, parent, child_extra_data, association) {
    const current_day = this.getFullDate();
    child = {...child.fields};
    parent = {...parent.fields};

    // const child_extra_data = await UserExtraData.createFrom({user_id: this.proposal.__get('child_id')});
    // const association = await Association.baseCreateFrom({id: this.proposal.__get('association_id')});

    const child_sex = child.sex == 1 ? 'Муж' : 'Жен';

    Object.keys(child).map(key => {
        if (child[key] == null)
            child[key] = "";
    });

    Object.keys(parent).map(key => {
        if (parent[key] == null)
            parent[key] = "";
    });

    const child_birthday_date = new Date(child_extra_data.__get('birthday'));
    const child_month = (child_birthday_date.getMonth() + 1) > 9 ? (child_birthday_date.getMonth() + 1) : "0" + (child_birthday_date.getMonth() + 1);
    const child_day = (child_birthday_date.getDate()) > 9 ? (child_birthday_date.getDate()) : "0" + (child_birthday_date.getDate());
    const child_birthday = child_birthday_date.getFullYear() + '-' + child_month + '-' + child_day;

    const child_residence_flat = child_extra_data.__get('residence_flat') == null ? "" : `, кв. ` + child_extra_data.__get('residence_flat');
    const child_residence_address = child_extra_data.__get('residence_address') + child_residence_flat;

    const child_registration_flat = child_extra_data.__get('registration_flat') == null ? "" : `, кв. ` + child_extra_data.__get('registration_flat');
    const child_registration_address = child_extra_data.__get('registration_address') + child_registration_flat;

    const child_ovz = child_extra_data.ovz == 1 ? 'Да' : 'Нет';


    this.file = {
        content: `<style>
        p {
            font-family: Georgia, 'Times New Roman', Times, serif;
        }
        </style>
        <div style='width: 300px; float: right; display: block;'>
            <p style='font-size: 14pt;'>Директору</p>
            <p style=''>ГБНОУ &laquo;Академия цифровых технологий&raquo;<br>
            Ковалеву Дмитрию Сергеевичу</p>
            <p style='text-align: left; padding-bottom: 0; margin-bottom: 0;'>От <u>` + parent.surname + ' ' + parent.name + ' ' + parent.lastname + `</u></p>
            <p style='font-size: 8pt; margin-top: 0;text-align: center; padding-top: 0;'>(ФИО родителя полностью)</p>
        </div>

        <div style='padding-top: 200px; width: 94%; margin-left: 3%;'>
            <h2 style='text-align: center;'>ЗАЯВЛЕНИЕ</h2>
            <p style='padding-bottom: 0; margin-bottom: 0;'>Я, <u>` + parent.surname + ' ' + parent.name + ' ' + parent.lastname + `</u>,</p>
            <p style='font-size: 8pt; margin-left: 40px; padding-bottom: 0; padding-top: 0; margin-top: 0; margin-bottom: 0;'>(ФИО родителя полностью)</p>
            <p style='padding-bottom: 0; margin-bottom: 0; padding-top: 0; margin-top: 0;'>являясь (родителем/законным представителем) прошу зачислить моего ребенка</p>
            <p style='font-size: 8pt; margin-left: 130px; padding-bottom: 0; padding-top: 0; margin-top: 0; margin-bottom: 0;'>(нужное подчеркнуть)</p>
            <p style='padding-bottom: 0; margin-bottom: 0; padding-top: 0; margin-top: 0;'>в Государственное бюджетное нетиповое образовательное учреждение &laquo;Академия цифровых технологий&raquo; Санкт-Петербурга</p>

            <p>Объединение: <u>` + association.__get('name') + `</u></p>

            <b>Сведения о ребенке</b>

            <ol>
                <li><b>Фамилия, имя, отчество:</b> 													<u>` + child.surname + ' ' + child.name + ' ' + child.lastname + `</u></li>
                <li><b>Пол</b> <i>(муж/жен)</i><b>:</b> 											<u>` + child_sex + `</u></li>
                <li><b>Дата рождения:</b> 															<u>` + child_birthday + `</u></li>
                <li><b>Гражданство</b> <i>(государство)</i><b>:</b> 								<u>` + child_extra_data.__get('state') + `</u></li>
                <li><b>Регистрация</b> <i>(постоянная/временная)</i><b>:</b> 						<u>` + 'Постоянная' + `</u></li>
                <li><b>Адрес фактического проживания:</b> 											<u>` + child_residence_address + `</u></li>
                <li><b>Адрес регистрации по месту жительства:</b> 									<u>` + child_registration_address +  `</u></li>
                <li><b>Контактный телефон ребенка:</b> 												<u>` + child.phone + `</u></li>
                <li><b>Контактный телефон родителя (законного представителя):</b> 					<u>` + parent.phone + `</u></li>
                <li><b>Адрес электронной почты:</b> 												<u>` + parent.email + `</u></li>
                <li><b>Образовательное учреждение по основному месту обучения:</b> 					<u>` + child_extra_data.__get('studyPlace') + `</u></li>
                <li><b>Относится ли ребенок к категории лиц из числа ОВЗ</b> <i>(ДА/НЕТ &ndash; в целях возможности создания соответствующих условий при организации образовательного процесса)</i><b>:</b>
                <u>` + child_ovz + `</u></li>
            </ol>

            <p>С Уставом, Положением о порядке приёма, перевода, отчисления и исключения детей, Положением о формах, Правилами внутреннего распорядка учащихся, образовательной программой, расписанием, правилами проведения вступительных испытаний ознакомлен.</p>
        </div>


        <div style='width: 94%; margin-left: 3%;'>
            <div style='margin-top: 40px'>
                <p>"___" _____________ 202__</p>
            </div>

            <div style='float: right; display: inline-block; width: 200px; margin-top: -40px; right: 3%;'>

                 <p style='text-align: center;margin-bottom: 0; padding-bottom: 0;'>_____________________</p>
                 <p style='text-align: center; font-size: 8pt; padding-top: 0; margin-top: 0; margin-bottom: 0; padding-bottom: 0;'>Подпись родителя</p>
            </div>
        </div>`
    }
    return await this.generate();
}

Pdf.prototype.generateResolution = async function (child, parent, childExtraData) {
    const current_day = this.getFullDate();
    parent = {...parent.fields};
    child = {...child.fields};
    childExtraData = {...childExtraData.fields};

    const child_residence_flat = childExtraData.residence_flat == null ? "" : `, кв. ` + childExtraData.residence_flat;
    const child_residence_address = childExtraData.residence_address + child_residence_flat;

    const child_registration_flat = childExtraData.registration_flat == null ? "" : `, кв. ` + childExtraData.registration_flat;
    const child_registration_address = childExtraData.registration_address + child_registration_flat;


    Object.keys(child).map(key => {
        if (child[key] == null)
            child[key] = "";
    });

    Object.keys(parent).map(key => {
        if (parent[key] == null)
            parent[key] = "";
    });

    Object.keys(childExtraData).map(key => {
        if (childExtraData[key] == null)
            childExtraData[key] = "";
    });

    this.file = {
        content: `<style>
        p {
            font-family: Georgia, 'Times New Roman', Times, serif;
        }
        </style>
        <!-- Новая страница -->
        <div style='width: 94%; margin-left: 3%; margin-top: 20px;'>
            <p style='text-align: center;'>СОГЛАСИЕ РОДИТЕЛЯ/ЗАКОННОГО ПРЕДСТАВИТЕЛЯ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ НЕСОВЕРШЕННОЛЕТНЕГО</p>

            <p style='font-size: 9pt; margin-bottom: 17px; margin-bottom: 0; padding-bottom: 0;'>Я, <u>` + parent.surname + ' ' + parent.name + ' ' + parent.lastname + `</u></p>
            <p style='font-size: 6pt; text-align: center; margin-top: 0pt; padding-top: 0;'><i>(ФИО родителя или законного представителя)</i></p>


            <p style='font-size: 9pt;'>Паспорт (серия, номер) _____________ №______________________</p>
            <p style='font-size: 9pt;'>Выдан______________________________________________________________________________________________________________________</p>
            <p style='font-size: 9pt; margin-bottom: 0; padding-bottom: 0;'>_____________________________________________________________________________________________________________________________</p>
            <p style='text-align: center; font-size: 6pt; margin-top: 0pt; padding-top: 0;'><i>когда и кем выдан</i></p>
            <p style='font-size: 9pt; margin-bottom: 0; padding-bottom: 0;margin-top: 0pt; padding-top: 0;'>_____________________________________________________________________________________________________________________________</p>
            <p style='text-align: center; font-size: 6pt; margin-top: 0pt; padding-top: 0; width: 100%;'><i>в случае опекунства указать реквизиты документа, на основании которого осуществляется опека или попечительство</i></p>


            <p style='font-size: 9pt; margin-bottom: 0pt; padding-bottom: 0;'>являясь законным представителем несовершеннолетнего, приходящегося мне _____________________,</p>
            <p style='font-size: 9pt;'>зарегистрированного по адресу: <u>` + child_registration_address + `</u>, ФИО несовершеннолетнего <u>` + child.surname + ' ' + child.name + ' ' + child.lastname + `</u> в соответствии с Федеральным законом № от 27.7.2006 № 152-ФЗ «О персональных данных», даю свое согласие на обработку моих персональных данных и персональных данных несовершеннолетнего, относящихся исключительно к ниже перечисленным категориям персональных данных, в <b>ГБНОУ «Академия цифровых технологий»</b>, расположенное по адресу: 197198, Санкт-Петербург, Большой проспект П.С., 29/2 (далее Академия).</p>

            <p style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>
                <b style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'><i style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>Перечень персональных данных, на обработку которых дается согласие:</i></b>
                <p style='font-size: 8pt; margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>- персональные данные представителя: фамилия, имя, отчество, дата рождения, пол; реквизиты документа, удостоверяющего личность; гражданство, адреса регистрации и фактического проживания, СНИЛС, контактные телефоны, место работы;</p>
                <p style='font-size: 8pt; margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>- персональные данные несовершеннолетнего: фамилия, имя, отчество, дата рождения, пол, реквизиты документа, удостоверяющего личность, фотография, адреса регистрации и фактического проживания, СНИЛС; данные о состоянии здоровья (в объеме, необходимом для допуска к обучению и создания оптимальных условий обучения); место обучения (учреждение, класс); информация об участии и результатах участия в конкурсах, олимпиадах, фестивалях, конференциях, соревнованиях и других массовых мероприятиях.</p>
                <p style='font-size: 8pt;'><b style='font-size: 8pt;'><i style='font-size: 8pt;'>Цель обработки персональных данных</i></b>: реализация образовательной деятельности в соответствии с Федеральным законом от 29.12.2012 № 273-ФЗ «Об образовании в Российской Федерации»; обеспечение выполнения Академией уставных задач в объеме, необходимом для получения несовершеннолетним дополнительного образования по дополнительным общеразвивающим программам и предпрофессиональным программам; внесение сведений о несовершеннолетнем в информационные системы для персонализированного учета контингента обучающихся по дополнительным общеобразовательным программам; размещение на официальном сайте и официальных группах социальных сетей образовательной организации информации об участии и достижениях несовершеннолетнего в конкурсах, олимпиадах, фестивалях, конференциях, соревнованиях и других массовых мероприятиях с указанием его фамилии, имени, места обучения (учреждение, группа, фото, видео).</p>

                <p style='font-size: 8pt;'>Настоящее согласие предоставляется мной на осуществление действий в отношении моих персональных данных и персональных данных несовершеннолетнего, которые необходимы для достижения указанных выше целей, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение, также осуществление действий, предусмотренных действующим законодательством Российской Федерации.</p>

                <p style='font-size: 8pt; margin-top: 5px; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>Я даю согласие на предоставление моих персональных данных и персональных данных несовершеннолетнего третьим лицам, для обеспечения выполнения образовательным учреждением уставных задач в объеме, необходимом для получения несовершеннолетним дополнительного образования по дополнительным общеразвивающим программам и предпрофессиональным программам и для реализации целей обработки персональных данных, указанных в настоящем Согласии.</p>

                <p style='font-size: 8pt; margin-top: 5px; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>Я проинформирован, что Академия гарантирует обработку моих персональных данных и персональных данных несовершеннолетнего в соответствии с действующим законодательством Российской Федерации.
            Настоящее согласие на обработку персональных данных действует в течение всего периода обучения несовершеннолетнего в образовательной организации и в течение всего срока хранения информации.</p>

                <p style='font-size: 8pt; margin-top: 5px; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>Я проинформирован(а) о том, что в соответствии с ч.2 ст.9 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» я имею право отозвать настоящее согласие в любой момент посредством составления соответствующего письменного документа, который может быть направлен мной в адрес Академии по почте заказным письмом с уведомлением о вручении, либо вручен лично под расписку уполномоченному представителю Академии.</p>

                <p style='font-size: 8pt; margin-top: 5px; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>Я подтверждаю, что, давая такое согласие, я действую по собственной воле и в интересах несовершеннолетнего.</p>

                <div>
                    <div style='margin-top: 40px;'>
                        <p style='font-size: 8pt;'>"___" _____________ 202__</p>
                    </div>
                    <div style='float: right; margin-top: -35px;'>
                        <p style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>
                            __________________ / <u style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>` + parent.surname + ' ' + parent.name + ' ' + parent.lastname + `</u> /
                        </p>
                        <i style='font-size: 6pt; margin-top: 0pt; padding-top: 0;'>&nbsp;подпись&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;расшифровка подписи</i>
                    </div>
                </div>
        </div>
        `
    }
    return await this.generate();
}

module.exports = Pdf;
