export default function Probowka(wlasciwosci){

	return(
		<div
			className={ wlasciwosci.wybrany ? "probowka wybrany" : "probowka"}
			onClick={ wlasciwosci.onClick }
		>
			{ wlasciwosci.kolory ?
				wlasciwosci.kolory.map((a, b) => {
					return(
						<div
							key={b}
							className="kolorek"
							style={{color: a, backgroundColor: a}}
						/>
					);
				})
				: "Brak kolorow"
			}
		</div>
	);
}