/*
TODO:
- dodac wiecej poziomow
- ladniejsze animacje
- responsywnosc
- mozliwosc cofania ruchow
- mozliwosc zresetowania poziomu
*/

import { useState } from 'react';
import plansze from "./plansze.json";
import Probowka from "./Probowka";

export default function Aplikacja() {
	const [level, setLevel] = useState({
		prob: null,
		id: parseInt((localStorage.getItem('odblokowany') ? localStorage.getItem('odblokowany') : 0)),
		firstselect: null
	});
	const [wygrana, setWygrana] = useState(0);

	const dostanLevel = (id) => {
		console.log("Wczytuje poziom", id);
		// Teraz zadzieje sie dekodowanie z jsona ( jsona enkodowanego (tablicy))...
		// PONIEWAŻ NIESTETY bez tego podejscia zmienna prob bylaby obiektem referencyjnym.
		// i wszelkie zmiany na prob tyczylyby sie wczytanej struktury poziomow
		// REFERENCJA: const prob = plansze[id]['probowki'];
		// BRAK REFERENCJI:
		const prob = JSON.parse(JSON.stringify(plansze[id]['probowki']));

		setLevel({prob: prob, id: id, firstselect: null});
		setWygrana(0);
	};

	const ustawFirstSelect = (ktora) => {
		if( level.firstselect === ktora){
			//wybrany ten sam, odznaczam sie
			setLevel({prob: level.prob, id: level.id, firstselect: null});
		} else {
			//sprawdz czy te same kolory, jak tak to przelej z aktualnego
			// first select do teraz wybranej probowki, jesli nie,
			//  wybierz firstselect jako teraz wybrany
			if (level.firstselect === null){
				setLevel({prob: level.prob, id: level.id, firstselect: ktora});
			} else {
				sprawdzKolory(level.firstselect, ktora) ? przelej(level.firstselect, ktora) : setLevel({prob: level.prob, id: level.id, firstselect: ktora});
				sprawdzWygrana();
			}
		}
	};

	const nextPoziom = () => {
		const ilePoziomow = plansze.length - 1;
		const ktoryWczytywany = level.id + 1;
		//jesli zapisany odblokowany lvl
		if(ilePoziomow >= ktoryWczytywany){
			if(ktoryWczytywany > localStorage.getItem('odblokowany')){
				localStorage.setItem('odblokowany', ktoryWczytywany);
			}
			return(
				<div className="wygrales">
					<h3>Gratulacje!</h3>
					<button onClick={ () => dostanLevel(level.id + 1) }>
						Przejdź dalej
					</button>
				</div>
			);
		} else {
			return(
				<div className="wygrales">
					<h3>Gratulacje!</h3>
					<h5>Przeszedłeś wszystkie poziomy!</h5>
					<button onClick={ () => dostanLevel(0) }>
						Zacznij od nowa
					</button>
				</div>
			);
		}
	};

	const sprawdzWygrana = () => {
		var wszystkieKolory = [];
		var rozbiteKolory = 0;
		var ileNiepustych = 0;
		level.prob.forEach((probowka) => {
			if(probowka.length > 0){
				var rozneKoloryTejProbowki = [];
				probowka.forEach((kolorek) => {
					if(!rozneKoloryTejProbowki.includes(kolorek)){
						rozneKoloryTejProbowki.push(kolorek);
					}
					if(!wszystkieKolory.includes(kolorek)){
						wszystkieKolory.push(kolorek);
					}
				});
				rozbiteKolory += rozneKoloryTejProbowki.length;
				ileNiepustych += 1;
			}
		});
		(wszystkieKolory.length === rozbiteKolory) && (rozbiteKolory === ileNiepustych) && setWygrana(1);
	};

	const sprawdzKolory = (skad, dokad) => {
		var aktProb = level.prob[skad];
		var aktProbTop = aktProb[aktProb.length - 1];
		var nowaProb = level.prob[dokad];
		var nowaProbTop = nowaProb[nowaProb.length - 1];
		if( (aktProbTop === nowaProbTop) || (nowaProbTop === undefined)){
			return 1;
		} else {
			return 0;
		}
	};

	const przelej = (skad, dokad) => {
		var zmianyProb = level.prob;
		//sprawdzic tez czy sie nie "wyleje"
		if(zmianyProb[dokad].length < 5){
			//przelewanie
			zmianyProb[dokad].push(zmianyProb[skad].pop());
			setLevel({prob: level.prob, id: level.id, firstselect: null});
			//sprawdz czy KOLEJNY kolor skad-dokad jest taki sam - taka mini rekurencja
			sprawdzKolory(skad, dokad) && przelej(skad, dokad);
		}
	};

	return (
		<>
			<h1>WaterSort Puzzle</h1>
			<h4>Rafał Zakrzewski - 10037</h4>
			<h5>Programowanie wizualno-obiektowe</h5>
			<div className="plansza" >
				<button className="resetuj" onClick={() => dostanLevel(level.id)}>Od nowa</button>
				{ (wygrana === 1) && nextPoziom() }
				{ level.prob ? level.prob.map((a, b) => {
					return(
						<Probowka
							kolory={a}
							key={b}
							wybrany={ (level.firstselect === b) }
							onClick={() => ustawFirstSelect(b) }
						/>
					);
				}) : dostanLevel(level.id) }
			<div className="poziomy">
				<div className="tytul">Poziomy</div>
				{
					plansze.map((a, b) => {
						var c = localStorage.getItem('odblokowany');
						if(b <= c){
							return(
								<div key={b} className={((b === level.id) ? "wyborPoziomu odblokowany wybranyPoziom" : "wyborPoziomu odblokowany")} onClick={ () => dostanLevel(b) }>
									{ a['id'] }
								</div>
							);
						} else {
							return(
								<div key={b} className="wyborPoziomu">
									{ a['id'] }
								</div>
							);
						}
					})
				}
			</div>
			</div>
		</>
	);
}