document.addEventListener("DOMContentLoaded", () => {
	const cards = Array.from(document.querySelectorAll(".resource-card"));
	const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));

	// Effet hover amélioré
	cards.forEach((card) => card.classList.add("enhanced-hover"));

	// Apparition progressive avec IntersectionObserver
	const revealCard = (card) => {
		card.classList.add("is-visible");
	};

	if ("IntersectionObserver" in window) {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						revealCard(entry.target);
						obs.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
		);

		cards.forEach((card) => observer.observe(card));
	} else {
		cards.forEach(revealCard);
	}

	// FILTRE PROJETS
	const applyFilter = (filter) => {
		cards.forEach((card) => {
			const techs = (card.dataset.tech || "")
				.toLowerCase()
				.split(/[,\s]+/)
				.filter(Boolean);

			const shouldShow = filter === "all" || techs.includes(filter);

			card.style.display = shouldShow ? "" : "none";
			card.classList.toggle("is-hidden", !shouldShow);

			if (shouldShow) revealCard(card);
		});

		updateSectionsVisibility();
	};

	// Gestion clic filtres
	filterButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			filterButtons.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			applyFilter(btn.dataset.filter || "all");
		});
	});

	// Animation douce à l'apparition
	cards.forEach((card) => {
		card.classList.add("card-enter");
		setTimeout(() => card.classList.remove("card-enter"), 400);
	});

	// Filtre par défaut
	applyFilter("all");
});

// CACHER LES SECTIONS VIDES
function updateSectionsVisibility() {
	const sections = document.querySelectorAll(".section-display");

	sections.forEach((section) => {
		// On ignore le header + sections ne contenant pas de cards
		if (!section.querySelector(".resource-card")) return;

		const visibleCards = [
			...section.querySelectorAll(".resource-card"),
		].filter((card) => card.style.display !== "none");

		section.style.display = visibleCards.length ? "" : "none";
	});
}
