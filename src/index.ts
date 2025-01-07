import chalk from "chalk";
import automatizacion from "../assets/json/automatizacion.json" assert { type: "json" };
import devopsculture from "../assets/json/devopsculture.json" assert { type: "json" };
import herramientas from "../assets/json/herramientas.json" assert { type: "json" };
import redes from "../assets/json/redes.json" assert { type: "json" };
import sistemas from "../assets/json/sistemas.json" assert { type: "json" };
import contenedores from "../assets/json/contenedores.json" assert { type: "json" };
import proyectos from "../assets/json/proyectos.json" assert { type: "json" };
import cicd from "../assets/json/cicd.json" assert { type: "json" };
import _ from "lodash";
import readline from "readline-sync";

const tests = {
  automatizacion,
  devopsculture,
  herramientas,
  redes,
  sistemas,
  contenedores,
  proyectos,
  cicd,
};

const arrAsignaturas = [
  "automatizacion",
  "devopsculture",
  "herramientas",
  "redes",
  "sistemas",
  "contenedores",
  "proyectos",
  "cicd",
];

function prompt(message: string): string {
  return readline.question(message);
}

function listaAsignaturas(): void {
  console.log("========================");
  arrAsignaturas.forEach((a, i) => {
    console.log(i + 1 + ": " + arrAsignaturas[i]);
  });
}

function prepararAsignatura(testsAsignatura: any[]) {
  const arrPreguntas = [];
  testsAsignatura.forEach((testTema, indextema) => {
    testTema.test.forEach((pregunta, indexpregunta) => {
      pregunta.tema = indextema + 1;
      pregunta.num = indexpregunta + 1;
      arrPreguntas.push(pregunta);
    });
  });
  preparacionTest = _.shuffle(arrPreguntas);
  erroresTest = [];
}

function prepararTemaAsignatura(testsAsignatura, indexTema) {
  const testTema = testsAsignatura[indexTema];
  const arrPreguntas = [];
  testTema.test.forEach((pregunta, indexpregunta) => {
    pregunta.tema = indexTema + 1;
    pregunta.num = indexpregunta + 1;
    arrPreguntas.push(pregunta);
  });
  preparacionTest = _.shuffle(arrPreguntas);
  erroresTest = [];
}

function preguntarAsignatura(): string {
  let resp = "N";
  preparacionTest.forEach((preg, indPreg) => {
    const boolPreguntar = preguntar(preg, indPreg);
    if (!boolPreguntar) {
      erroresTest.push(preg);
    }
  });
  if (erroresTest.length > 0) {
    resp = prompt(
      `Has fallado ${erroresTest.length} de ${preparacionTest.length} Quieres repasar los fallos? (S/n): `
    );
    preparacionTest = _.shuffle(erroresTest);
    erroresTest = [];
  } else {
    console.log(chalk.green("¡Has contestado a todas!"));
  }
  return resp;
}

function convertirOpciones(shuffled, texto) {
  let retTexto = texto;
  if (shuffled) {
    for (let i = 0; i < shuffled.length; i++) {
      const newIndex = _.find(shuffled, (obj) => obj.firstOrder == i).index;
      retTexto = retTexto.replace(
        new RegExp("\\$" + i, "g"),
        (newIndex + 1).toString()
      );
    }
  }
  return retTexto;
}

function preguntar(objPregunta, indPregunta): boolean {
  let shuffled;
  let returnCorrecta = false;
  console.log(
    chalk.bold(
      chalk.whiteBright(
        `PREGUNTA (${indPregunta + 1}/${preparacionTest.length}):  ${
          objPregunta.pregunta
        }`
      )
    )
  );
  console.log(chalk.italic("(para saber el num. del tema, escribe '?')"));
  if (!objPregunta.multi && objPregunta.resp.length > 0) {
    console.log(chalk.italic("(Escribe '0' si no lo sabes)"));
  }
  // Múltiples opciones * * * * * * * * * * * * * * * * *
  if (objPregunta.multi && objPregunta.multi.length) {
    objPregunta.resp.forEach((resp, iResp) => {
      resp.correcta =
        _.filter(objPregunta.multi, (indexM) => indexM == iResp).length > 0;
      resp.firstOrder = iResp;
    });
    shuffled = _.shuffle(objPregunta.resp);
    const correctas = [];
    shuffled.forEach((resp, iResp) => {
      resp.index = iResp;
    });
    shuffled.forEach((resp, iResp) => {
      console.log(
        chalk.gray(iResp + 1 + ". " + convertirOpciones(shuffled, resp.texto))
      );
      if (resp.correcta) {
        correctas.push(iResp + 1);
      }
    });
    const strCorrectas = correctas.join(",");
    let selec = "";
    do {
      selec = prompt(
        chalk.blue("Opciones separadas por comas (por ejemplo: '2,4'): ")
      );
      if (selec == "?") {
        console.log(chalk.yellow("TEMA " + objPregunta.tema));
      }
    } while (!selec || selec == "?");
    if (strCorrectas == selec.replace(/ /g, "")) {
      console.log(chalk.green("¡¡CORRECTO!!"));
      returnCorrecta = true;
    } else {
      console.log(
        chalk.red("Incorrecto, la opciones correctas son: " + strCorrectas)
      );
    }
  }
  // Una sola opción * * * * * * * * * * * * * * * * *
  else if (objPregunta.resp.length > 0) {
    objPregunta.resp.forEach((resp, iResp) => {
      resp.correcta = objPregunta.correct == iResp;
      resp.firstOrder = iResp;
    });
    shuffled = _.shuffle(objPregunta.resp);
    shuffled.forEach((resp, iResp) => {
      resp.index = iResp;
    });
    shuffled.forEach((resp, iResp) => {
      console.log(
        chalk.gray(iResp + 1 + ". " + convertirOpciones(shuffled, resp.texto))
      );
    });
    let selec = -1;
    while (isNaN(selec) || selec < 0 || selec > objPregunta.resp.length) {
      const escribeOpc = prompt(chalk.blue("Escribe opcion: "));
      if (escribeOpc == "?") {
        console.log(chalk.yellow("TEMA " + objPregunta.tema));
      } else {
        selec = escribeOpc == "" ? -1 : parseInt(escribeOpc);
      }
    }
    const correcta = _.find(shuffled, (obj) => obj.correcta).index;
    if (correcta + 1 == selec) {
      console.log(chalk.green("¡¡CORRECTO!!"));
      returnCorrecta = true;
    } else {
      console.log(
        chalk.red(
          "Incorrecto, la respuesta es " +
            (correcta + 1) +
            ": " +
            convertirOpciones(shuffled, shuffled[correcta].texto)
        )
      );
    }
  }
  // Relacionar dos listas * * * * * * * * * * * * * * * * *
  else if (objPregunta.options.length > 0) {
    const arrOpciones = [];
    objPregunta.options.forEach((texto, index) => {
      arrOpciones.push({ texto, index });
    });
    const arrRelac = [];
    objPregunta.rels.forEach((texto, index) => {
      arrRelac.push({ texto, index, newIndex: 0 });
    });
    const shufledOpc = _.shuffle(arrOpciones);
    const shufledRel = _.shuffle(arrRelac);
    shufledRel.forEach((sr, index) => {
      sr.newIndex = index;
    });
    const arrLetras = ["A", "B", "C", "D"];
    const arrOrden = [];
    shufledOpc.forEach((opc, indexOpc) => {
      console.log(chalk.gray(arrLetras[indexOpc] + ". " + opc.texto));
      arrOrden.push(
        arrLetras[indexOpc] +
          "" +
          (_.find(shufledRel, (sr) => sr.index == opc.index).newIndex + 1)
      );
    });
    shufledRel.forEach((rel, indexRel) => {
      console.log(chalk.magenta(indexRel + 1 + ". " + rel.texto));
    });
    let selec = "";
    do {
      selec = prompt(
        chalk.blue(
          "Pon cada letra y su numero correspondiente (por ejemplo: 'a4,b2,c1,d3'): "
        )
      );
      if (selec == "?") {
        console.log(chalk.yellow("TEMA " + objPregunta.tema));
      }
    } while (!selec || selec == "?");
    selec = selec.replace(/ /g, "").toUpperCase();
    const arrSelec = _.sortBy(selec.split(","), [(txt) => txt]);
    selec = arrSelec.join(",");
    const strCorrectas = arrOrden.join(",");
    if (strCorrectas == selec) {
      console.log(chalk.green("¡¡CORRECTO!!"));
      returnCorrecta = true;
    } else {
      console.log(chalk.red("Incorrecto, el orden es: " + strCorrectas));
    }
  }
  if (objPregunta.feedback) {
    console.log(
      chalk.yellow(convertirOpciones(shuffled, objPregunta.feedback))
    );
  }
  return returnCorrecta;
}

let preparacionTest = [];
let erroresTest = [];
let selec = 1;
listaAsignaturas();
selec = parseInt(prompt("Elige asignatura: "));
if (!isNaN(selec) && selec > 0 && selec < arrAsignaturas.length + 1) {
  const testAsignatura = tests[arrAsignaturas[selec - 1]];
  const numTema = parseInt(
    prompt(`Elige tema (1 - ${testAsignatura.length}) o (T)odos: `)
  );
  if (isNaN(numTema) || !numTema) {
    prepararAsignatura(testAsignatura);
  } else {
    prepararTemaAsignatura(testAsignatura, numTema - 1);
  }
  let resp = "N";
  //preguntar(testAsignatura[0].test[7], 0);
  do {
    resp = preguntarAsignatura();
  } while (resp == "" || resp == "s" || resp == "S");
}
/*
for (let iAs = 0; iAs < 5; iAs++) {
  tests[arrAsignaturas[iAs]].forEach((test) => {
    test.test.forEach((preg) => {
      for (let iAs2 = 0; iAs2 < 5; iAs2++) {
        if (iAs != iAs2) {
          tests[arrAsignaturas[iAs2]].forEach((test2) => {
            test2.test.forEach((preg2) => {
              if (preg.pregunta == preg2.pregunta) {
                console.log(preg.pregunta);
              }
            });
          });
        }
        //
      }
    });
  });
}
*/
