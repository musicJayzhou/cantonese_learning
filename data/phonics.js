/* 發音板块：普通話與廣東話音標對應表（Yale 耶魯音標）
   独立于 COURSES 的长期工具书数据，由 js/phonics.js 渲染 */
window.PHONICS_DATA = {
  /* ---------- 19 聲母 ---------- */
  "initials": {
    "allInOne": "audio/phonics/initials/all_in_one.mp3",
    "exAllInOne": "audio/phonics/initials/ex_all_in_one.m4a",
    "rows": [
      {"c":"b","syl":"bā","zh":"巴","mand":"b","a":"audio/phonics/initials/items/01a.mp3","ex":{"jyut":"bā-sí","zh":"巴士","mand":"公車","a":"audio/phonics/initials/items/01b.mp3"}},
      {"c":"d","syl":"dā / dá","zh":"打","mand":"d","a":"audio/phonics/initials/items/02a.mp3","ex":{"jyut":"yāt dā gāi-dáan","zh":"一打雞蛋","mand":"12只雞蛋","a":"audio/phonics/initials/items/02b.mp3"},"ex2":{"jyut":"dá dihn-wá","zh":"打電話","mand":"-","a":"audio/phonics/initials/items/03b.mp3"},"a2":"audio/phonics/initials/items/03a.mp3"},
      {"c":"g","syl":"gā","zh":"加","mand":"g","a":"audio/phonics/initials/items/04a.mp3","ex":{"jyut":"gā-ga","zh":"加價","mand":"漲價","a":"audio/phonics/initials/items/04b.mp3"}},
      {"c":"p","syl":"pā","zh":"趴","mand":"p","a":"audio/phonics/initials/items/05a.mp3","ex":{"jyut":"pā-deih-hùhng","zh":"趴地熊","mand":"-","a":"audio/phonics/initials/items/05b.mp3"}},
      {"c":"t","syl":"tā","zh":"他","mand":"t","a":"audio/phonics/initials/items/06a.mp3","ex":{"jyut":"wàih-tā-mihng","zh":"維他命","mand":"維生素","a":"audio/phonics/initials/items/06b.mp3"}},
      {"c":"k","syl":"kā","zh":"卡","mand":"k","a":"audio/phonics/initials/items/07a.mp3","ex":{"jyut":"kā-tūng-pín","zh":"卡通片","mand":"動畫","a":"audio/phonics/initials/items/07b.mp3"}},
      {"c":"l","syl":"lā","zh":"啦","mand":"l","a":"audio/phonics/initials/items/08a.mp3","ex":{"jyut":"lā-lā-déui","zh":"啦啦隊","mand":"-","a":"audio/phonics/initials/items/08b.mp3"}},
      {"c":"m","syl":"mā","zh":"媽","mand":"m","a":"audio/phonics/initials/items/09a.mp3","ex":{"jyut":"màh-mā","zh":"媽媽","mand":"-","a":"audio/phonics/initials/items/09b.mp3"}},
      {"c":"n","syl":"nàh","zh":"拿","mand":"n","a":"audio/phonics/initials/items/10a.mp3","ex":{"jyut":"Gā-nàh-daaih","zh":"加拿大","mand":"-","a":"audio/phonics/initials/items/10b.mp3"}},
      {"c":"ng","syl":"ngàh","zh":"牙","mand":"-","a":"audio/phonics/initials/items/11a.mp3","ex":{"jyut":"ngàh-tung","zh":"牙痛","mand":"-","a":"audio/phonics/initials/items/11b.mp3"}},
      {"c":"f","syl":"fā","zh":"花","mand":"f","a":"audio/phonics/initials/items/12a.mp3","ex":{"jyut":"fā-sām","zh":"花心","mand":"三心兩意","a":"audio/phonics/initials/items/12b.m4a"}},
      {"c":"h","syl":"hā","zh":"蝦","mand":"(h)","a":"audio/phonics/initials/items/13a.mp3","ex":{"jyut":"hā-gáau","zh":"蝦餃","mand":"-","a":"audio/phonics/initials/items/13b.mp3"}},
      {"c":"j","syl":"jā","zh":"喳","mand":"(j)","a":"audio/phonics/initials/items/15a.mp3","ex":{"jyut":"jā-jàh","zh":"喳喳","mand":"嚒嚒喳喳","a":"audio/phonics/initials/items/15b.mp3"}},
      {"c":"ch","syl":"chā","zh":"叉","mand":"(q)","a":"audio/phonics/initials/items/16a.mp3","ex":{"jyut":"chā-sīu","zh":"叉燒","mand":"-","a":"audio/phonics/initials/items/16b.mp3"}},
      {"c":"s","syl":"sā","zh":"沙","mand":"(x)","a":"audio/phonics/initials/items/14a.mp3","ex":{"jyut":"sā-tāan","zh":"沙灘","mand":"海灘","a":"audio/phonics/initials/items/14b.mp3"}},
      {"c":"gw","syl":"gwā","zh":"瓜","mand":"(gu)","a":"audio/phonics/initials/items/17a.mp3","ex":{"jyut":"nàahm-gwā","zh":"南瓜","mand":"-","a":"audio/phonics/initials/items/17b.mp3"}},
      {"c":"kw","syl":"kwā","zh":"誇","mand":"(ku)"},
      {"c":"w","syl":"wā","zh":"蛙","mand":"w","a":"audio/phonics/initials/items/18a.mp3","ex":{"jyut":"chīng-wā","zh":"青蛙","mand":"-","a":"audio/phonics/initials/items/18b.mp3"}},
      {"c":"y","syl":"yā","zh":"吔","mand":"y","a":"audio/phonics/initials/items/19a.mp3","ex":{"jyut":"āi-yā-yā","zh":"哎吔吔","mand":"-","a":"audio/phonics/initials/items/19b.mp3"}}
    ]
  },
  /* ---------- 51+2 韻母（按讲义练习顺序 01-56） ---------- */
  "finals": {
    "allInOne": "audio/phonics/finals/all_in_one.mp3",
    "allInOneW": "audio/phonics/finals/all_in_one_with_initials.mp3",
    "exAllInOne": "audio/phonics/exfinals/all_in_one.mp3",
    "families": [
      {"label":"a 家族 (a-aak)","audio":"audio/phonics/finals/groups/a-aak.mp3"},
      {"label":"ai 家族 (ai-ak)","audio":"audio/phonics/finals/groups/ai-ak.mp3"},
      {"label":"e 家族 (e-ei)","audio":"audio/phonics/finals/groups/e-ei.mp3"},
      {"label":"eui 家族 (eui-euk)","audio":"audio/phonics/finals/groups/eui-euk.mp3"},
      {"label":"i 家族 (i-ik)","audio":"audio/phonics/finals/groups/i-ik.mp3"},
      {"label":"m / ng","audio":"audio/phonics/finals/groups/m-ng.mp3"},
      {"label":"o 家族 (o-ok)","audio":"audio/phonics/finals/groups/o-ok.mp3"},
      {"label":"u 家族 (u-uk)","audio":"audio/phonics/finals/groups/u-uk.mp3"},
      {"label":"yu 家族 (yu-yut)","audio":"audio/phonics/finals/groups/yu-yut.mp3"},
      {"label":"🔊 全部家族連讀","audio":"audio/phonics/finals/groups/finals-all-in.mp3"}
    ],
    "exFamilies": [
      {"label":"fā … bāk","audio":"audio/phonics/exfinals/groups/01.m4a"},
      {"label":"máaih … baak","audio":"audio/phonics/exfinals/groups/02.m4a"},
      {"label":"chē … fèih","audio":"audio/phonics/exfinals/groups/03.m4a"},
      {"label":"sī … sīk","audio":"audio/phonics/exfinals/groups/04.m4a"},
      {"label":"ló … lohk","audio":"audio/phonics/exfinals/groups/05.m4a"},
      {"label":"gú … Jūng","audio":"audio/phonics/exfinals/groups/06.m4a"},
      {"label":"heui … geuk","audio":"audio/phonics/exfinals/groups/07.mp3"},
      {"label":"yúh … syut","audio":"audio/phonics/exfinals/groups/08.m4a"},
      {"label":"mh` … ng´h","audio":"audio/phonics/exfinals/groups/09.m4a"}
    ],
    "rows": [
      {"f":"a","syl":"fā","zh":"花","word":{"jyut":"fā-sām","zh":"花心","mand":"-"},"n":1,"mand":"a"},
      {"f":"ai","syl":"sāi","zh":"西","word":{"jyut":"sāi-gwā","zh":"西瓜","mand":"-"},"n":2,"mand":"-"},
      {"f":"au","syl":"dáu","zh":"豆","word":{"jyut":"hùhng-dáu","zh":"紅豆","mand":"-"},"n":3,"wordA":"audio/phonics/exfinals/items/03b.m4a","mand":"(ou)"},
      {"f":"au","syl":"dauh","zh":"豆","word":{"jyut":"dauh-fuh-fā","zh":"豆腐花","mand":"-"},"n":4,"sylA":"audio/phonics/exfinals/items/04a.mp3","wordA":"audio/phonics/exfinals/items/04ab.mp3","mand":"(ou)"},
      {"f":"am","syl":"sām","zh":"心","word":{"jyut":"sām-chìhng","zh":"心情","mand":"-"},"n":5,"wordA":"audio/phonics/exfinals/items/05ab.mp3","mand":"-"},
      {"f":"an","syl":"fān","zh":"分","word":{"jyut":"fān-sou","zh":"分數","mand":"-"},"n":6,"mand":"(en)"},
      {"f":"ang","syl":"dāng","zh":"燈","word":{"jyut":"dāng-dáam","zh":"燈膽","mand":"燈泡"},"n":7,"mand":"(eng)"},
      {"f":"ap","syl":"sāp","zh":"濕","word":{"jyut":"sāp-chán","zh":"濕疹","mand":"-"},"n":8,"mand":"-"},
      {"f":"at","syl":"māt","zh":"乜","word":{"jyut":"māt-yéh","zh":"乜嘢","mand":"什麼"},"n":9,"mand":"-"},
      {"f":"ak","syl":"bāk","zh":"北","word":{"jyut":"Bāk-gīng","zh":"北京","mand":"-"},"n":10,"mand":"-"},
      {"f":"aai","syl":"máaih","zh":"買","word":{"jyut":"máaih-yéh","zh":"買嘢","mand":"買東西"},"n":11,"mand":"ai"},
      {"f":"aau","syl":"báau","zh":"飽","word":{"jyut":"báau-wòh","zh":"飽和","mand":"-"},"n":12,"mand":"(ao)"},
      {"f":"aam","syl":"sāam","zh":"三","word":{"jyut":"sāam-jih-gīng","zh":"三字經","mand":"-"},"n":13,"mand":"-"},
      {"f":"aan","syl":"dāan","zh":"單","word":{"jyut":"dāan-wái","zh":"單位","mand":"-"},"n":14,"mand":"(an)"},
      {"f":"aang","syl":"hàahng","zh":"行","word":{"jyut":"hàahng-louh","zh":"行路","mand":"走路"},"n":15,"mand":"(ang)"},
      {"f":"ong","syl":"hòhng","zh":"行","word":{"jyut":"ngàhn-hòhng","zh":"銀行","mand":"-"},"n":16,"sylA":"audio/phonics/exfinals/items/16a.m4a","wordA":"audio/phonics/exfinals/items/16b.m4a","mand":"-"},
      {"f":"ang","syl":"hàhng","zh":"行","word":{"jyut":"hàhng-yàhn-louh","zh":"行人路","mand":"人行道"},"n":17,"sylA":"audio/phonics/exfinals/items/17a.m4a","wordA":"audio/phonics/exfinals/items/17b.mp3","mand":"(eng)"},
      {"f":"aap","syl":"aap","zh":"鴨","word":{"jyut":"aap-dáan","zh":"鴨蛋","mand":"-"},"n":18,"mand":"-"},
      {"f":"aat","syl":"baat","zh":"八","word":{"jyut":"baat baak","zh":"八百","mand":"-"},"n":19,"mand":"-"},
      {"f":"aak","syl":"baak","zh":"百","word":{"jyut":"baak-daap","zh":"百搭","mand":"-"},"n":20,"wordA":"audio/phonics/exfinals/items/20b.m4a","mand":"-"},
      {"f":"e","syl":"chē","zh":"車","word":{"jyut":"chē-pàaih","zh":"車牌","mand":"-"},"n":21,"mand":"-"},
      {"f":"eng","syl":"leng","zh":"靚","word":{"jyut":"leng-néui","zh":"靚女","mand":"美女/亮女"},"n":22,"mand":"-"},
      {"f":"ek","syl":"tek","zh":"踢","word":{"jyut":"tek-bō","zh":"踢波","mand":"踢球"},"n":23,"mand":"-"},
      {"f":"ei","syl":"fèih","zh":"肥","word":{"jyut":"fèih-neih","zh":"肥膩","mand":"油膩"},"n":24,"mand":"ei"},
      {"f":"i","syl":"sī","zh":"詩","word":{"jyut":"sī-gīng","zh":"詩經","mand":"-"},"n":25,"mand":"(i)"},
      {"f":"iu","syl":"diu","zh":"釣","word":{"jyut":"diu-yú","zh":"釣魚","mand":"-"},"n":26,"sylA":"audio/phonics/exfinals/items/26b.m4a","wordA":"audio/phonics/exfinals/items/26bb.mp3","mand":"iu"},
      {"f":"im","syl":"tìhm","zh":"甜","word":{"jyut":"tìhm-bán","zh":"甜品","mand":"-"},"n":27,"mand":"-"},
      {"f":"in","syl":"mìhn","zh":"綿","word":{"jyut":"mìhn-yéung","zh":"綿羊","mand":"-"},"n":28,"mand":"(in)"},
      {"f":"ing","syl":"sīng","zh":"星","word":{"jyut":"sīng-kèih","zh":"星期","mand":"-"},"n":29,"sylA":"audio/phonics/exfinals/items/29ab.mp3","wordA":"audio/phonics/exfinals/items/29a.mp3","mand":"(ing)"},
      {"f":"ip","syl":"jip","zh":"接","word":{"jyut":"jip fong-hohk","zh":"接放學","mand":"下課來接"},"n":30,"mand":"-"},
      {"f":"it","syl":"yiht","zh":"熱","word":{"jyut":"yiht-séui","zh":"熱水","mand":"-"},"n":31,"mand":"-"},
      {"f":"ik","syl":"sìk","zh":"識","word":{"jyut":"sìk-fo","zh":"識貨","mand":"真會挑東西"},"n":32,"mand":"-"},
      {"f":"o","syl":"ló","zh":"攞","word":{"jyut":"ló-yéh","zh":"攞嘢","mand":"拿東西"},"n":33,"mand":"o"},
      {"f":"on","syl":"hòhn","zh":"韓","word":{"jyut":"hòhn-mán","zh":"韓文","mand":"韓語"},"n":34,"mand":"-"},
      {"f":"ot","syl":"hot","zh":"渴","word":{"jyut":"géng-hot","zh":"頸渴","mand":"口渴"},"n":35,"mand":"-"},
      {"f":"ou","syl":"bōu","zh":"煲","word":{"jyut":"bōu-séui","zh":"煲水","mand":"燒水"},"n":36,"mand":"-"},
      {"f":"oi","syl":"hōi","zh":"開","word":{"jyut":"hōi-dāng","zh":"開燈","mand":"-"},"n":37,"sylA":"audio/phonics/exfinals/items/37ab.mp3","wordA":"audio/phonics/exfinals/items/37a.mp3","mand":"-"},
      {"f":"ong","syl":"fong","zh":"放","word":{"jyut":"fong-dài","zh":"放低","mand":"放下"},"n":38,"mand":"-"},
      {"f":"ok","syl":"lohk","zh":"落","word":{"jyut":"lohk-yúh","zh":"落雨","mand":"下雨"},"n":39,"mand":"-"},
      {"f":"u","syl":"gú","zh":"估","word":{"jyut":"gú-háh","zh":"估吓","mand":"猜一猜"},"n":40,"mand":"(u)"},
      {"f":"ui","syl":"guih","zh":"攰","word":{"jyut":"guih-séi","zh":"攰死","mand":"累死"},"n":41,"mand":"-"},
      {"f":"un","syl":"mùhn","zh":"門","word":{"jyut":"mùhn-chán","zh":"門診","mand":"-"},"n":42,"mand":"-"},
      {"f":"ut","syl":"wuht","zh":"活","word":{"jyut":"wuht-faht","zh":"活佛","mand":"-"},"n":43,"mand":"-"},
      {"f":"uk","syl":"luhk","zh":"六","word":{"jyut":"luhk-hahp-chói","zh":"六合彩","mand":"彩票"},"n":44,"mand":"-"},
      {"f":"ung","syl":"jùng","zh":"中","word":{"jyut":"Jūng-gwok","zh":"中國","mand":"-"},"n":45,"sylA":"audio/phonics/exfinals/items/45ab.m4a","wordA":"audio/phonics/exfinals/items/45a.mp3","mand":"(ong)"},
      {"f":"eui","syl":"heui","zh":"去","word":{"jyut":"heui-gāai","zh":"去街","mand":"上街"},"n":46,"sylA":"audio/phonics/exfinals/items/46ab.mp3","wordA":"audio/phonics/exfinals/items/46a.mp3","mand":"-"},
      {"f":"eun","syl":"jēun","zh":"樽","word":{"jyut":"yahp-jēun","zh":"入樽","mand":"灌籃"},"n":47,"mand":"-"},
      {"f":"eut","syl":"chēut","zh":"出","word":{"jyut":"chēut-heui","zh":"出去","mand":"-"},"n":48,"mand":"-"},
      {"f":"eu","syl":"hēu","zh":"靴","word":{"jyut":"máh-hēu","zh":"馬靴","mand":"-"},"n":49,"sylA":"audio/phonics/exfinals/items/49a.m4a","wordA":"audio/phonics/exfinals/items/49b.m4a","mand":"-"},
      {"f":"eung","syl":"chèuhng","zh":"詳","word":{"jyut":"chèuhng-sai","zh":"詳細","mand":"-"},"n":50,"mand":"-"},
      {"f":"euk","syl":"geuk","zh":"腳","word":{"jyut":"geuk-yan","zh":"腳印","mand":"-"},"n":51,"mand":"-"},
      {"f":"yu","syl":"yúh","zh":"雨","word":{"jyut":"yúh-lāu","zh":"雨褸","mand":"雨衣"},"n":52,"mand":"ü"},
      {"f":"yun","syl":"tyùhn","zh":"屯","word":{"jyut":"tyùhn-mùhn","zh":"屯門","mand":"-"},"n":53,"mand":"ün"},
      {"f":"yut","syl":"syut","zh":"雪","word":{"jyut":"syut-gōu","zh":"雪糕","mand":"冰淇淋"},"n":54,"mand":"-"},
      {"f":"m","syl":"mh`","zh":"唔","word":{"jyut":"m`h-gōi","zh":"唔該","mand":"謝謝/請"},"n":55,"mand":"-"},
      {"f":"ng","syl":"ng´h","zh":"五","word":{"jyut":"ng´h-gām","zh":"五金","mand":"-"},"n":56,"mand":"-"}
    ]
  },
  /* ---------- 對比練習 ---------- */
  "comparison": {
    "allInOne": "audio/phonics/finals/comparison/finals-comparison.mp3",
    "rows": [
      {"label":"ei / ai / aai","audio":"audio/phonics/finals/comparison/ei-ai-aai.m4a"},
      {"label":"ou / au / aau","audio":"audio/phonics/finals/comparison/ou-au-aau.m4a"},
      {"label":"o / on / ong","audio":"audio/phonics/finals/comparison/o-on-ong.m4a"},
      {"label":"ong / ung / eung","audio":"audio/phonics/finals/comparison/ong-ung-eung.m4a"},
      {"label":"ip / it / ik","audio":"audio/phonics/finals/comparison/ip-it-ik.m4a"},
      {"label":"im / in / ing","audio":"audio/phonics/finals/comparison/im-in-ing.m4a"},
      {"label":"ap / at / ak","audio":"audio/phonics/finals/comparison/ap-at-ak.m4a"},
      {"label":"aap / aat / aak","audio":"audio/phonics/finals/comparison/aap-aat-aak.m4a"},
      {"label":"an / ang / am","audio":"audio/phonics/finals/comparison/an-ang-am.m4a"},
      {"label":"aan / aang / aam","audio":"audio/phonics/finals/comparison/aan-aang-aam.m4a"},
      {"label":"o / ok / uk","audio":"audio/phonics/finals/comparison/o-ok-uk.m4a"},
      {"label":"eun / eut / uk","audio":"audio/phonics/finals/comparison/eun-eut-uk.m4a"},
      {"label":"sap / sat / sak","audio":"audio/phonics/finals/comparison/sap-sat-sak.m4a"},
      {"label":"sam / san / sang","audio":"audio/phonics/finals/comparison/sam-san-sang.m4a"},
      {"label":"sak / sang","audio":"audio/phonics/finals/comparison/sak-sang.m4a"},
      {"label":"sap / sam","audio":"audio/phonics/finals/comparison/sap-sam.m4a"},
      {"label":"sat / san","audio":"audio/phonics/finals/comparison/sat-san.m4a"}
    ],
    "initialAllInOne": "audio/phonics/comparison_initial/all_in_one.mp3",
    "initialRows": [
      {"cells":[["gēi","機"],["gāi","雞"],["gāai","街"]],"audio":"audio/phonics/comparison_initial/01.mp3"},
      {"cells":[["hóu","好"],["háu","口"],["háau","巧"]],"audio":"audio/phonics/comparison_initial/02.mp3"},
      {"cells":[["gō","哥"],["gōn","乾"],["gōng","江"]],"audio":"audio/phonics/comparison_initial/03.mp3"},
      {"cells":[["sōng","桑"],["sūng","鬆"],["sēung","雙"]],"audio":"audio/phonics/comparison_initial/04.mp3"},
      {"cells":[["yihp","業"],["yiht","熱"],["yihk","翼"]],"audio":"audio/phonics/comparison_initial/05.mp3"},
      {"cells":[["yīm","閹"],["yīn","煙"],["yīng","英"]],"audio":"audio/phonics/comparison_initial/06.mp3"},
      {"cells":[["sāp","濕"],["sāt","失"],["sāk","塞"]],"audio":"audio/phonics/comparison_initial/07.mp3"},
      {"cells":[["saap","霎"],["saat","殺"],["saak","索"]],"audio":"audio/phonics/comparison_initial/08.mp3"},
      {"cells":[["sān","新"],["sāng","生"],["sām","心"]],"audio":"audio/phonics/comparison_initial/09.mp3"},
      {"cells":[["sāan","山"],["sāang","生"],["sāam","三"]],"audio":"audio/phonics/comparison_initial/10.mp3"},
      {"cells":[["hoh","賀"],["hohk","學"],["huhk","斛"]],"audio":"audio/phonics/comparison_initial/11.mp3"},
      {"cells":[["sēun","詢"],["sēut","恤"],["sūk","叔"]],"audio":"audio/phonics/comparison_initial/12.mp3"}
    ]
  },
  /* ---------- 學習重點 ---------- */
  "focus": {
    "blocks": [
      {"label":"前後鼻韻母發音技巧 👅","kind":"note",
       "note":"ng 後鼻韻母：舌根要碰到普通話聲母 g 的位置（廣東話冇 z/c/s、zh/ch/sh，所以舌頭中間撓起嚟）。n 前鼻韻母：舌尖動作同普通話 n 一樣。"},
      {"label":"n / l 例外 ⚠️","kind":"chips","audio":"audio/phonics/focus/p12-p20.mp3",
       "note":"n 同 l 廣東話同普通話基本對應，只有兩個例外：",
       "chips":[
         {"jyut":"luhng","zh":"弄","audio":"audio/phonics/focus/items/12.m4a"},
         {"jyut":"nāp","zh":"粒"},
         {"jyut":"ngóh","zh":"我（ng 聲母難點）","audio":"audio/phonics/focus/items/13.m4a"}
       ]},
      {"label":"變音：3/4/5/6 聲 → 2 聲（士）","kind":"chips",
       "chips":[
         {"jyut":"sih→sí","zh":"士→屎","audio":"audio/phonics/focus/items/15a.m4a"},
         {"jyut":"dīk-sí","zh":"的士","audio":"audio/phonics/focus/items/15b.m4a"},
         {"jyut":"bā-sí","zh":"巴士","audio":"audio/phonics/focus/items/15c.m4a"},
         {"jyut":"sih-bīng","zh":"士兵","audio":"audio/phonics/focus/items/15d.m4a"}
       ]},
      {"label":"變音：3/4/5/6 聲 → 2 聲（舖/髮）","kind":"chips",
       "chips":[
         {"jyut":"gām-póu","zh":"金舖","audio":"audio/phonics/focus/items/16a.m4a"},
         {"jyut":"pou-táu","zh":"舖頭","audio":"audio/phonics/focus/items/16b.m4a"},
         {"jyut":"tàuh-faat","zh":"頭髮","audio":"audio/phonics/focus/items/16c.m4a"}
       ]},
      {"label":"變音：1 聲 → 4 聲","kind":"chips",
       "chips":[
         {"jyut":"gòh-gō","zh":"哥哥","audio":"audio/phonics/focus/items/17a.m4a"},
         {"jyut":"màh-mā","zh":"媽媽","audio":"audio/phonics/focus/items/17b.m4a"},
         {"jyut":"Jeh-tìhng-tíng","zh":"謝婷婷","audio":"audio/phonics/focus/items/17c.m4a"},
         {"jyut":"jā-jàh（例外）","zh":"喳喳","audio":"audio/phonics/focus/items/17d.m4a"}
       ]},
      {"label":"變音：ing → eng（頂）","kind":"chips",
       "chips":[
         {"jyut":"díng→déng","zh":"頂","audio":"audio/phonics/focus/items/18a.m4a"},
         {"jyut":"sāan-déng","zh":"山頂","audio":"audio/phonics/focus/items/18b.m4a"},
         {"jyut":"díng-tìn-laahp-deih","zh":"頂天立地","audio":"audio/phonics/focus/items/18c.m4a"},
         {"jyut":"díng-déng","zh":"頂頂","audio":"audio/phonics/focus/items/18d.m4a"}
       ]},
      {"label":"變音：ing → eng（青）","kind":"chips",
       "chips":[
         {"jyut":"chīng-wā","zh":"青蛙","audio":"audio/phonics/focus/items/19a.m4a"},
         {"jyut":"chēng-pìhng-gwó","zh":"青蘋果","audio":"audio/phonics/focus/items/19b.m4a"},
         {"jyut":"chēng-gwà","zh":"青瓜","audio":"audio/phonics/focus/items/19c.m4a"},
         {"jyut":"chīng-wā m`h sihk chēng-gwà","zh":"青蛙唔食青瓜","audio":"audio/phonics/focus/items/19d.m4a"}
       ]},
      {"label":"前鼻韻母同音字（in/im）","kind":"pairs","audio":"audio/phonics/focus/p21-p22.mp3",
       "rows":[
         {"label":"chīn 千 / chīm 簽","audio":"audio/phonics/focus/items/21a.m4a"},
         {"label":"dín 典 / dím 點","audio":"audio/phonics/focus/items/21b.m4a"},
         {"label":"hīn 牽 / hīm 謙","audio":"audio/phonics/focus/items/21c.m4a"},
         {"label":"kìhn 虔 / kìhm 箝","audio":"audio/phonics/focus/items/21d.m4a"},
         {"label":"lìhn 連 / lìhm 廉","audio":"audio/phonics/focus/items/21e.m4a"},
         {"label":"tīn 天 / tīm 添","audio":"audio/phonics/focus/items/21f.m4a"},
         {"label":"tìhn 田 / tìhm 甜","audio":"audio/phonics/focus/items/21g.m4a"}
       ]},
      {"label":"前鼻韻母同音字（an/am 等）","kind":"pairs",
       "rows":[
         {"label":"chāan 餐 / chāam 參","audio":"audio/phonics/focus/items/22a.m4a"},
         {"label":"daan 旦 / daam 擔","audio":"audio/phonics/focus/items/22b.m4a"},
         {"label":"gaan 澗 / gaam 監","audio":"audio/phonics/focus/items/22c.m4a"},
         {"label":"nàahn 難 / nàahm 男","audio":"audio/phonics/focus/items/22d.m4a"},
         {"label":"sāan 山 / sāam 衫","audio":"audio/phonics/focus/items/22e.m4a"},
         {"label":"chān 親 / chām 侵","audio":"audio/phonics/focus/items/22f.m4a"},
         {"label":"gán 緊 / gám 錦","audio":"audio/phonics/focus/items/22g.m4a"},
         {"label":"sahn 慎 / sahm 甚","audio":"audio/phonics/focus/items/22h.m4a"}
       ]},
      {"label":"sāp sāt sāk sām sān sāng 對照","kind":"pairs","audio":"audio/phonics/focus/p04_comparison.mp3",
       "rows":[
         {"label":"sāp 濕"},
         {"label":"sāt 虱 / 室失膝瑟"},
         {"label":"sāk 塞"},
         {"label":"sām 心芯蔘琛深森郴"},
         {"label":"sān 燊身新薪伸申呻紳辛"},
         {"label":"sāng 生笙甥"}
       ]},
      {"label":"羅馬拼音系統說明 📖","kind":"note",
       "note":"課堂用嘅係 Yale system（耶魯音標）。廣東話大約有六種標音系統：耶魯、粵拼、黃錫凌、國際音標、廣州及劉錫祥。"}
    ]
  },
  /* ---------- 聲調 ---------- */
  "tones": {
    "audios": [
      {"label":"🔊 施史試時市事（sī sí si sìh síh sih）","audio":"audio/phonics/tone1to6_si-sik.m4a"},
      {"label":"🔊 數字訣（三 九 四 零 五 二）","audio":"audio/phonics/tone1to6_2-9.m4a"}
    ],
    "rows": [
      {"n":"1","name":"陰平（高平/高降）","val":"55/53","eg":"詩 sī","num":"三 sāam","yin":"識 sīk（7 陰入）"},
      {"n":"2","name":"陰上（高上）","val":"35","eg":"史 sí","num":"九 gáu","yin":""},
      {"n":"3","name":"陰去","val":"33","eg":"試 si","num":"四 sei","yin":"錫 sik（8 中入）"},
      {"n":"4","name":"陽平（低降）","val":"21/11","eg":"時 sìh","num":"零 lìhng","yin":""},
      {"n":"5","name":"陽上（低上）","val":"13","eg":"市 síh","num":"五 ng´h","yin":""},
      {"n":"6","name":"陽去（低平）","val":"22","eg":"事 sih","num":"二 yih","yin":"食 sihk（9 陽入）"}
    ]
  }
};
