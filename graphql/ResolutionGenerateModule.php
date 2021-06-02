<?php
namespace GraphQL\Application\Modules;

use GraphQL\Application\AppContext;
use GraphQL\Application\Database\DataSource;
use GraphQL\Application\Entity\Association;
use GraphQL\Application\Entity\User;
use GraphQL\Application\File\File;
use GraphQL\Application\File\FileStorage;
use GraphQL\Server\RequestError;
use Mpdf\Mpdf;

/**
 * Class ProposalGenerateModule
 * Модуль по генерации заявлений ребенка
 * @package GraphQL\Application\Modules
 */

class ResolutionGenerateModule implements Module {

    /**
     * @param AppContext $context
     * @return array
     * @throws \GraphQL\Server\RequestError
     * @throws \Mpdf\MpdfException
     * @throws \setasign\Fpdi\PdfParser\PdfParserException
     * @throws \PhpOffice\PhpWord\Exception\Exception
     */
    public function result(AppContext $context): array {

        // Есть ли доступ
        $context->viewer->hasAccessOrError(6);

        $child_id = $_GET["child_id"];

        /** @var User $child */
        $child = DataSource::find("User", $child_id);

        $mpdf = new Mpdf();

        $parent_surname = $context->viewer->surname;
        $parent_name = $context->viewer->name;
        $parent_midname = $context->viewer->midname ?? "";
//        $parent_phone_number = $context->viewer->phone_number;
//        $parent_email = $context->viewer->email;

        $child_surname = $child->surname;
        $child_name = $child->name;
        $child_midname = $child->midname;
//        $child_birthday = date("d.m.Y",strtotime($child->birthday));
//        $child_residence_address = $child->residence_address;
        $child_registration_address = $child->registration_address;
//        $child_phone_number = $child->phone_number ?? "";
//        $child_study_place = $child->study_place;
//        $child_study_class = $child->study_class;
//        $child_sex = ($child->sex == "м") ? "муж" : "жен";
//        $child_state = $child->state;
//        $child_registration_type = ($child->registration_type == "да") ? "постоянная" : "временная";
//        $child_ovz = $child->ovz;

        $months = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        ];

        $year = date("Y");
        $month = $months[date('n')-1];
        $day = date("d");

        //$current_day = "&laquo;<u>{$day}</u>&raquo; <u>{$month}</u> {$year}&nbsp;г.";
        $current_day = "&laquo;____&raquo; _________________ 202__&nbsp;г.";


        //TODO: оптимизировать отступ для подписи "подпись"
        $padding = "";
        for($i = 0; $i < mb_strlen($parent_surname); $i++) $padding .= "&nbsp;";
        for($i = 0; $i < mb_strlen($parent_name); $i++) $padding .= "&nbsp;";
        for($i = 0; $i < mb_strlen($parent_midname); $i++) $padding .= "&nbsp;";
//
////        $mpdf->SetImportUse();
////        $mpdf->SetImportUse();
////        $mpdf->percentSubset = 0;
//
//        //"\{\$parent_full_name\}"
//        //"test"
//
//        /*
//        $search = array(
//            'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
//            'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXZZZZZZZZ'
//        );
//
//        $replacement = array(
//            "personalised for Jos\xc3\xa9 Bloggs",
//            "COPYRIGHT: Licensed to Jos\xc3\xa9 Bloggs"
//        );
//
//        error_reporting(0);
//
//        $mpdf->OverWrite(FileStorage::getStoragePath() . '/proposal_template/proposal_libre.pdf', $search, $replacement, 'I', FileStorage::getStoragePath() . '/proposal_template/mpdf.pdf' ) ;
//        */
//
//
//
//        /*
//        $mpdf->OverWrite(FileStorage::getStoragePath() . '/proposal_template/proposal_libre.pdf', [
//            "\{\$child_full_name\}"
//        ], [
//            "test"
//        ], 'D' );
//        */
//
//
//
//        /*
//        $mpdf->WriteHTML("
//
//            <div style='width: 300px; float: right; display: block;'>
//                <p style='font-size: 14pt;'>Директору</p>
//                <p style=''>ГБНОУ «Академия цифровых технологий»<br>
//                Ковалеву Дмитрию Сергеевичу</p>
//                <p style='text-align: left; padding-bottom: 0; margin-bottom: 0;'>От <u>{$parent_surname} {$parent_name} {$parent_midname}</u></p><p style='margin-left: 23px; font-size: 6pt; padding-top: 0; margin-top: 0;'>(ФИО родителя полностью)</p>
//            </div>
//
//            <div style='padding-top: 140px; width: 100%;'>
//                <h1 style='text-align: center;'>ЗАЯВЛЕНИЕ</h1>
//                <h3 style='text-align: center;'>Прошу зачислить моего ребенка,</h3>
//                <h3 style='font-weight: normal; text-align: center; padding-bottom: 0; padding-top: 0; margin-top: 0; margin-bottom: 0;'><u>{$child_surname} {$child_name} {$child_midname}</u>,</h3>
//                <p style='font-size: 6pt; text-align: center; padding-bottom: 0; padding-top: 0; margin-top: 0; margin-bottom: 0;'>(ФИО ребенка полностью)</p>
//                <h3 style='font-weight: normal; text-align: center; padding-bottom: 0; margin-bottom: 0;'><u>{$child_birthday}</u></h3>
//                <p style='font-size: 6pt; text-align: center; padding-bottom: 0; padding-top: 0; margin-top: 0; margin-bottom: 0;'>Дата рождения</p>
//
//                <h3 style='text-align: center;'>Объединение:</h3>
//                <h3 style='font-weight: normal; text-align: center; padding-bottom: 0; padding-top: 0; margin-top: 0; margin-bottom: 0;'><u>{$group_title}</u></h3>
//
//                <b>Сведения о ребенке:</b>
//
//                <ol>
//                    <li><b>Фамилия, имя, отчество:</b> 													<u>{$child_surname} {$child_name} {$child_midname}</u></li>
//                    <li><b>Дата рождения:</b> 															<u>{$child_birthday}</u></li>
//                    <li><b>Адрес проживания:</b> 														<u>{$child_residence_address}</u></li>
//                    <li><b>Контактный телефон ребенка (необязательно):</b> 								<u>{$child_phone_number}</u></li>
//                    <li><b>Контактный телефон<br>законного представителя (для экстренной связи):</b> 	<u>{$parent_phone_number}</u></li>
//                    <li><b>Адрес электронной почты (обязательно):</b> 									<u>{$parent_email}</u></li>
//                    <li><b>Школа</b> 																	<u>{$child_study_place}</u> <b>Класс</b> <u>{$child_study_class}</u></li>
//                </ol>
//
//                <p>С Уставом, правилами внутреннего распорядка учащихся, образовательной программой ознакомлен.</p>
//
//                <p>Образовательное учреждение оставляет за собой право на приостановление отношений (предоставление образовательных услуг) в одностороннем порядке без уведомления второй стороны - родителей (законных представителей) - в случае отсутствия обучающегося в течение месяца в образовательном учреждении без уважительной причины. После предоставления документов, подтверждающих причину отсутствия, ребёнок восстанавливается в объединении автоматически.</p>
//            </div>
//
//
//            <div>
//                <div>
//                    {$current_day}
//                </div>
//
//                <!-- TODO: убрать корявости? -->
//                <div style='float: right; display: block; width: 200px; margin-top: -23px;'>
//                     _____________________
//                     <p style='margin-left: 33px; font-size: 6pt; padding-top: 0; margin-top: 0; margin-bottom: 0; padding-bottom: 0;'>Подпись родителя</p>
//                </div>
//            </div>
//
//            <!-- Новая страница -->
//
//            <p style='text-align: center;'>СОГЛАСИЕ РОДИТЕЛЯ/ ЗАКОННОГО ПРЕДСТАВИТЕЛЯ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ НЕСОВЕРШЕННОЛЕТНЕГО</p>
//
//            <p style='font-size: 9pt; margin-bottom: 17px; margin-bottom: 0; padding-bottom: 0;'>Я, <u>{$parent_surname} {$parent_name} {$parent_midname}</u></p>
//            <p style='font-size: 6pt; margin-left: 17px; margin-top: 0pt; padding-top: 0;'>(ФИО родителя или законного представителя)</p>
//
//
//            <p style='font-size: 9pt;'>Паспорт (серия, номер) _____________ №______________________</p>
//            <p style='font-size: 9pt;'>Выдан______________________________________________________________________________________________________________________</p>
//            <p style='font-size: 9pt; margin-bottom: 0; padding-bottom: 0;'>_____________________________________________________________________________________________________________________________</p>
//            <i style='text-align: center; font-size: 6pt; margin-top: 0pt; padding-top: 0; width: 100%;'>когда и кем выдан</i>
//            <p style='font-size: 9pt; margin-bottom: 0; padding-bottom: 0;'>_____________________________________________________________________________________________________________________________</p>
//            <i style='text-align: center; font-size: 6pt; margin-top: 0pt; padding-top: 0; width: 100%;'>в случае опекунства указать реквизиты документа, на основании которого осуществляется опека или попечительство</i>
//
//
//            <p style='font-size: 9pt; margin-bottom: 0pt; padding-bottom: 0;'>являясь законным представителем несовершеннолетнего <u>{$child_surname} {$child_name} {$child_midname}</u>,</p>
//            <p style='font-size: 6pt; margin-left: 337px; margin-top: 0pt; padding-top: 0;'>(ФИО несовершеннолетнего)</p>
//            <p style='font-size: 9pt;'>приходящегося мне _____________________, зарегистрированного по адресу: <u>{$child_registration_address}</u> соответствии с Федеральным законом № от 27.7.2006 № 152-ФЗ «О персональных данных», даю свое согласие на обработку моих персональных данных и персональных данных несовершеннолетнего, относящихся исключительно к ниже перечисленным категориям персональных данных, в <b>ГБНОУ «Академия цифровых технологий»</b>, расположенное по адресу: 197198, Санкт-Петербург, Большой проспект П.С., 29/2 (далее Академия).</p>
//
//            <p style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>
//                <b style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'><i style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>Перечень персональных данных, на обработку которых дается согласие:</i></b>
//                <p style='font-size: 8pt; margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>- персональные данные представителя: фамилия, имя, отчество, дата рождения, пол; реквизиты документа, удостоверяющего личность; гражданство, адреса регистрации и фактического проживания, СНИЛС, контактные телефоны, место работы;</p>
//                <p style='font-size: 8pt; margin-top: 0; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>- персональные данные несовершеннолетнего: фамилия, имя, отчество, дата рождения, пол, реквизиты документа, удостоверяющего личность, фотография, адреса регистрации и фактического проживания, СНИЛС; данные о состоянии здоровья (в объеме, необходимом для допуска к обучению и создания оптимальных условий обучения); место обучения (учреждение, класс); информация об участии и результатах участия в конкурсах, олимпиадах, фестивалях, конференциях, соревнованиях и других массовых мероприятиях.</p>
//                <p style='font-size: 8pt;'><b style='font-size: 8pt;'><i style='font-size: 8pt;'>Цель обработки персональных данных</i></b>: реализация образовательной деятельности в соответствии с Федеральным законом от 29.12.2012 № 273-ФЗ «Об образовании в Российской Федерации»; обеспечение выполнения Академией уставных задач в объеме, необходимом для получения несовершеннолетним дополнительного образования по дополнительным общеразвивающим программам и предпрофессиональным программам; внесение сведений о несовершеннолетнем в информационные системы для персонализированного учета контингента обучающихся по дополнительным общеобразовательным программам; размещение на официальном сайте и официальных группах социальных сетей образовательной организации информации об участии и достижениях несовершеннолетнего в конкурсах, олимпиадах, фестивалях, конференциях, соревнованиях и других массовых мероприятиях с указанием его фамилии, имени, места обучения (учреждение, группа, фото, видео).</p>
//
//                <p style='font-size: 8pt;'>Настоящее согласие предоставляется мной на осуществление действий в отношении моих персональных данных и персональных данных несовершеннолетнего, которые необходимы для достижения указанных выше целей, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение, также осуществление действий, предусмотренных действующим законодательством Российской Федерации.</p>
//
//                <p style='font-size: 8pt; margin-top: 5px; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>Я даю согласие на предоставление моих персональных данных и персональных данных несовершеннолетнего третьим лицам, для обеспечения выполнения образовательным учреждением уставных задач в объеме, необходимом для получения несовершеннолетним дополнительного образования по дополнительным общеразвивающим программам и предпрофессиональным программам и для реализации целей обработки персональных данных, указанных в настоящем Согласии.</p>
//
//                <p style='font-size: 8pt; margin-top: 5px; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>Я проинформирован, что Академия гарантирует обработку моих персональных данных и персональных данных несовершеннолетнего в соответствии с действующим законодательством Российской Федерации.
//Настоящее согласие на обработку персональных данных действует в течение всего периода обучения несовершеннолетнего в образовательной организации и в течение всего срока хранения информации.</p>
//
//                <p style='font-size: 8pt; margin-top: 5px; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>Я проинформирован(а) о том, что в соответствии с ч.2 ст.9 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» я имею право отозвать настоящее согласие в любой момент посредством составления соответствующего письменного документа, который может быть направлен мной в адрес Академии по почте заказным письмом с уведомлением о вручении, либо вручен лично под расписку уполномоченному представителю Академии.</p>
//
//                <p style='font-size: 8pt; margin-top: 5px; padding-top: 0; margin-bottom: 0; padding-bottom: 0;'>Я подтверждаю, что, давая такое согласие, я действую по собственной воле и в интересах несовершеннолетнего.</p>
//
//                <p style='font-size: 8pt; margin-top: 10px; padding-top: 10px;'>
//                    {$current_day}
//                </p>
//
//                <p style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>
//                    <u style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>{$parent_name} {$parent_surname} {$parent_midname}</u> /__________________/
//                </p>
//
//                <i style='font-size: 6pt; margin-top: 0pt; padding-top: 0;'>расшифровка подписи&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$padding}&nbsp;подпись</i>
//
//
//            </p>
//
//            ");
//        */
//
//
////        $mpdf->pdf
//
////        $mpdf->SetImportUse();
//
//
//        /*
//         *
//         * Работает, но не меняет текст
//         *
//        $pagecount = $mpdf->SetSourceFile(FileStorage::getStoragePath()."/proposal_template/proposal_libre.pdf");
//
//
//        $mpdf->AddPage();
//        $template = $mpdf->importPage(1);
//        $mpdf->useTemplate($template);
//
//        $mpdf->AddPage();
//        $template = $mpdf->importPage(2);
//        $mpdf->useTemplate($template);
//
//
//        $mpdf->Output(FileStorage::getStoragePath()."/proposal_template/proposal_libre11.pdf", 'F');
//
//        $mpdf = new Mpdf();
//        $mpdf->percentSubset = 0;
//        $mpdf->OverWrite(FileStorage::getStoragePath() . '/proposal_template/proposal_libre11.pdf', [
//            "XXXXXXXXXXXXXXXXXXXXXXXXX"
//        ], [
//            "test"
//        ]);
//        */
//
//        //$mpdf->AddPage();
////        $mpdf->WriteHTML(file_get_contents(FileStorage::getStoragePath()."/proposal_template/proposal_page1.htm"));
////        $mpdf->AddPage();
////        $mpdf->WriteHTML(file_get_contents(FileStorage::getStoragePath()."/proposal_template/proposal_page2.htm"));
//
//
//
//
//        /*
//        $tplId = $mpdf->importPage(1);
//        $mpdf->useTemplate($tplId);
//        $tplId = $mpdf->importPage(2);
//        $mpdf->useTemplate($tplId);
//        */
//
////        $mpdf->Output(FileStorage::getStoragePath()."/proposal_template/proposal_libre.pdf", 'D');
////        $mpdf->Output();
////        echo(file_get_contents(FileStorage::getStoragePath()."/proposal_template/proposal_page1.html"));
//
//        /*
//                \PhpOffice\PhpWord\Settings::setPdfRendererPath(__DIR__ . '/../../vendor/dompdf/dompdf/src/Adapter/');
//                \PhpOffice\PhpWord\Settings::setPdfRendererName('TCPDF');
//
//                $phpWord = new \PhpOffice\PhpWord\PhpWord();
//
//        //Open template and save it as docx
//                $document = $phpWord->loadTemplate(FileStorage::getStoragePath()."/proposal_template/proposal.docx");
//                $document->saveAs(FileStorage::getStoragePath()."/proposal_template/temp.docx");
//
//        //Load temp file
//                $phpWord = \PhpOffice\PhpWord\IOFactory::load(FileStorage::getStoragePath()."/proposal_template/temp.docx");
//
//        //Save it
//                $xmlWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord , 'PDF');
//                $xmlWriter->save(FileStorage::getStoragePath()."/proposal_template/result111.pdf");
//        */
//
//// Убирай мета теги - они вызывают ошибку iconv(): Wrong charset, conversion from `UNICODE' to `UTF-8//TRANSLIT' is not allowed
        $mpdf->WriteHTML("
        	<style>
   			p {
    			font-family: Georgia, 'Times New Roman', Times, serif;
   			}
  			</style>
            <!-- Новая страница -->
            
            <p style='text-align: center;'>СОГЛАСИЕ РОДИТЕЛЯ/ЗАКОННОГО ПРЕДСТАВИТЕЛЯ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ НЕСОВЕРШЕННОЛЕТНЕГО</p>
            
            <p style='font-size: 9pt; margin-bottom: 17px; margin-bottom: 0; padding-bottom: 0;'>Я, <u>{$parent_surname} {$parent_name} {$parent_midname}</u></p>
            <p style='font-size: 6pt; text-align: center; margin-top: 0pt; padding-top: 0;'><i>(ФИО родителя или законного представителя)</i></p>
            
            
            <p style='font-size: 9pt;'>Паспорт (серия, номер) _____________ №______________________</p>
            <p style='font-size: 9pt;'>Выдан______________________________________________________________________________________________________________________</p>
            <p style='font-size: 9pt; margin-bottom: 0; padding-bottom: 0;'>_____________________________________________________________________________________________________________________________</p>
            <p style='text-align: center; font-size: 6pt; margin-top: 0pt; padding-top: 0;'><i>когда и кем выдан</i></p>
            <p style='font-size: 9pt; margin-bottom: 0; padding-bottom: 0;margin-top: 0pt; padding-top: 0;'>_____________________________________________________________________________________________________________________________</p>
            <p style='text-align: center; font-size: 6pt; margin-top: 0pt; padding-top: 0; width: 100%;'><i>в случае опекунства указать реквизиты документа, на основании которого осуществляется опека или попечительство</i></p>
            
            
            <p style='font-size: 9pt; margin-bottom: 0pt; padding-bottom: 0;'>являясь законным представителем несовершеннолетнего, приходящегося мне _____________________,</p>
            <p style='font-size: 9pt;'>зарегистрированного по адресу: <u>{$child_registration_address}</u>, ФИО несовершеннолетнего <u>{$child_surname} {$child_name} {$child_midname}</u> в соответствии с Федеральным законом № от 27.7.2006 № 152-ФЗ «О персональных данных», даю свое согласие на обработку моих персональных данных и персональных данных несовершеннолетнего, относящихся исключительно к ниже перечисленным категориям персональных данных, в <b>ГБНОУ «Академия цифровых технологий»</b>, расположенное по адресу: 197198, Санкт-Петербург, Большой проспект П.С., 29/2 (далее Академия).</p>
            
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
                
                <p style='font-size: 8pt; margin-top: 10px; padding-top: 10px;'>
                    {$current_day}
                </p>
                
                
                <p style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>
                __________________ / <u style='font-size: 8pt; margin-bottom: 0; padding-bottom: 0;'>{$parent_surname} {$parent_name} {$parent_midname}</u> /
                </p>
                <i style='font-size: 6pt; margin-top: 0pt; padding-top: 0;'>&nbsp;подпись&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{$padding}&nbsp;&nbsp;&nbsp;расшифровка подписи</i>
            </p>
            
            ");

        $mpdf->Output();

        die();
    }
}