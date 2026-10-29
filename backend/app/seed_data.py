from sqlalchemy.orm import Session
from .models import Equipment, EquipmentLoan, Tournament, TournamentResult, NancyEvent, UniversityMatch, Team

def seed_database(db: Session):
    # Si la base contient déjà des équipes, on ne réinsère pas
    if db.query(Team).first() is not None:
        return

    # 1. Matériel sportif (avec prix de rachat en cas de perte)
    equipments = [
        Equipment(
            name="Ballon Volley Molten V5M5000",
            category="Volley-ball",
            total_quantity=6,
            available_quantity=4,
            image_url="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&auto=format&fit=crop&q=80",
            condition="Neuf",
            replacement_price=45.0,
            description="Ballon de match officiel FFVB / Universitaire, cuir synthétique microfibre haute adhérence."
        ),
        Equipment(
            name="Ballon Basket Spalding TF-1000 Legacy",
            category="Basket-ball",
            total_quantity=5,
            available_quantity=3,
            image_url="https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=600&auto=format&fit=crop&q=80",
            condition="Bon état",
            replacement_price=50.0,
            description="Ballon d'intérieur professionnel grip supérieur, taille 7 officielle compétition."
        ),
        Equipment(
            name="Ballon de Foot Adidas Tiro Pro",
            category="Football",
            total_quantity=4,
            available_quantity=4,
            image_url="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80",
            condition="Bon état",
            replacement_price=35.0,
            description="Ballon de compétition thermo-collé norme FIFA Quality Pro, adapté gazon synthétique et naturel."
        ),
        Equipment(
            name="Jeu de 12 Chasubles Numérotées (Rouge)",
            category="Entraînement",
            total_quantity=2,
            available_quantity=1,
            image_url="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
            condition="Bon état",
            replacement_price=20.0,
            description="Pack de 12 chasubles respirantes numérotées de 1 à 12, idéales pour matchs inter-promos."
        ),
        Equipment(
            name="Jeu de 12 Chasubles Numérotées (Jaune Fluo)",
            category="Entraînement",
            total_quantity=2,
            available_quantity=2,
            image_url="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
            condition="Bon état",
            replacement_price=20.0,
            description="Pack de 12 chasubles haute visibilité pour différencier les équipes d'entraînement."
        ),
        Equipment(
            name="Set 4 Raquettes Badminton Yonex + 6 Volants",
            category="Badminton",
            total_quantity=4,
            available_quantity=2,
            image_url="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
            condition="Bon état",
            replacement_price=60.0,
            description="4 raquettes équilibrées en graphite + tube de volants plumes/nylon, housse incluse."
        ),
        Equipment(
            name="Table de Ping-Pong Pliable + 4 Raquettes & Balles",
            category="Tennis de Table",
            total_quantity=2,
            available_quantity=1,
            image_url="https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&auto=format&fit=crop&q=80",
            condition="Bon état",
            replacement_price=280.0,
            description="Table compacte sur roulettes avec filet réglable, prête à être installée dans le foyer."
        ),
        Equipment(
            name="Pompe à Ballon Haute Pression avec Manomètre",
            category="Accessoires",
            total_quantity=3,
            available_quantity=3,
            image_url="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80",
            condition="Neuf",
            replacement_price=15.0,
            description="Double action avec jauge de pression en bar/psi pour gonfler tous types de ballons."
        ),
        Equipment(
            name="Kit Pétanque Compétition (6 boules Obut + Cochonnet)",
            category="Loisirs",
            total_quantity=3,
            available_quantity=3,
            image_url="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&auto=format&fit=crop&q=80",
            condition="Bon état",
            replacement_price=30.0,
            description="Sacoche de 6 boules en acier chromé gravées, chiffonnette et cochonnet en buis."
        ),
        Equipment(
            name="Paire de Sifflets Fox 40 Classic + Cordons",
            category="Arbitrage",
            total_quantity=5,
            available_quantity=4,
            image_url="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80",
            condition="Neuf",
            replacement_price=10.0,
            description="Sifflet sans bille haute puissance sonore (115 dB) indispensable pour arbitrer les matchs."
        )
    ]
    db.add_all(equipments)
    db.commit()

    # 2. Équipes officielles TELECOM Nancy
    teams = [
        Team(name="Volley 1", sport="Volley-ball", category="Collectif", gender="Mixte", captain="Mathis D.", description="Équipe fanion de volley engagée en Championnat Académique FFSU"),
        Team(name="Volley 2", sport="Volley-ball", category="Collectif", gender="Mixte", captain="Lucas B.", description="Équipe 2 de volley - Championnat FFSU Lorraine"),
        Team(name="Volley 3", sport="Volley-ball", category="Collectif", gender="Mixte", captain="Hugo M.", description="Équipe 3 engagée en compétition et tournois amicaux"),
        Team(name="Volley F", sport="Volley-ball", category="Collectif", gender="Féminin", captain="Camille D.", description="Équipe 100% féminine de volley TELECOM Nancy"),
        Team(name="Beach-Volley Mixte", sport="Volley-ball", category="Collectif", gender="Mixte", captain="Nathan G.", description="Duo et quatuor de beach-volley pour les beaux jours"),
        Team(name="Basket 1", sport="Basket-ball", category="Collectif", gender="Mixte", captain="Antoine P.", description="Équipe de basket 5x5 FFSU"),
        Team(name="Basket 2", sport="Basket-ball", category="Collectif", gender="Mixte", captain="Paul D.", description="Équipe 2 de basket - Poule B FFSU"),
        Team(name="Basket F", sport="Basket-ball", category="Collectif", gender="Féminin", captain="Emma L.", description="Équipe féminine de basket"),
        Team(name="Basket 3x3", sport="Basket-ball", category="Collectif", gender="Mixte", captain="Thomas B.", description="Équipe 3x3 qualifiée pour les phases régionales FFSU"),
        Team(name="Foot 1", sport="Football", category="Collectif", gender="Mixte", captain="Julien R.", description="Équipe de football à 11 FFSU Lorraine"),
        Team(name="Foot 2", sport="Football", category="Collectif", gender="Mixte", captain="Romain B.", description="Équipe réserve football à 11 FFSU"),
        Team(name="Foot F", sport="Football", category="Collectif", gender="Féminin", captain="Léa M.", description="Équipe féminine de football à 8 FFSU Lorraine"),
        Team(name="Futsal 1", sport="Futsal", category="Collectif", gender="Mixte", captain="Enzo S.", description="Équipe 1 Futsal - Championnat Universitaire"),
        Team(name="Futsal 2", sport="Futsal", category="Collectif", gender="Mixte", captain="Mehdi K.", description="Équipe 2 Futsal - Tournois et matchs académiques"),
        Team(name="Rugby XV", sport="Rugby", category="Collectif", gender="Mixte", captain="Maxime V.", description="Les rugbymen de TELECOM Nancy"),
        Team(name="Rugby 7s Féminin", sport="Rugby", category="Collectif", gender="Féminin", captain="Sarah K.", description="Équipe de rugby à 7 féminine de TELECOM Nancy"),
        Team(name="Handball Mixte", sport="Handball", category="Collectif", gender="Mixte", captain="Clément T.", description="Équipe de hand FFSU"),
        Team(name="Handball F", sport="Handball", category="Collectif", gender="Féminin", captain="Chloé G.", description="Équipe féminine de handball FFSU"),
        Team(name="Badminton Indiv", sport="Badminton", category="Individuel", gender="Mixte", captain="Thomas N.", description="Compétiteurs individuels simples et doubles FFSU"),
        Team(name="Badminton Féminin", sport="Badminton", category="Individuel", gender="Féminin", captain="Clara V.", description="Compétitrices individuelles simples et doubles dames FFSU"),
        Team(name="Tennis de Table Indiv", sport="Tennis de Table", category="Individuel", gender="Mixte", captain="Alexandre K.", description="Compétiteurs individuels de tennis de table"),
        Team(name="Tennis Indiv", sport="Tennis", category="Individuel", gender="Mixte", captain="Pierre L.", description="Tournois individuels universitaires de tennis terre battue/dur"),
        Team(name="Tennis Féminin", sport="Tennis", category="Individuel", gender="Féminin", captain="Marion B.", description="Compétition individuelle dames FFSU"),
        Team(name="Escalade Bloc & Difficulté", sport="Escalade", category="Individuel", gender="Mixte", captain="Gabriel F.", description="Grimpeurs sur résine et falaises FFSU Grand-Est"),
        Team(name="Escalade Féminin", sport="Escalade", category="Individuel", gender="Féminin", captain="Laura P.", description="Grimpeuses TELECOM Nancy en championnat bloc"),
        Team(name="Course / Cross-Country", sport="Athlétisme", category="Individuel", gender="Mixte", captain="Victor H.", description="Équipe de cross-country universitaire et 10km de Nancy"),
        Team(name="Natation FFSU", sport="Natation", category="Individuel", gender="Mixte", captain="Louis M.", description="Nageurs sur 50m, 100m et relais 4x50m 4 nages"),
        Team(name="Judo & Arts Martiaux", sport="Judo", category="Individuel", gender="Mixte", captain="Bilal A.", description="Combattants universitaires ceintures marron et noires"),
        Team(name="Ultimate Frisbee", sport="Ultimate", category="Collectif", gender="Mixte", captain="Arthur R.", description="Équipe mixte d'ultimate frisbee de l'école"),
        Team(name="Cheerleading & Pompom", sport="Cheerleading", category="Collectif", gender="Féminin", captain="Inès B.", description="Troupe officielle de cheerleading et pompom de TELECOM Nancy"),
    ]
    db.add_all(teams)
    db.commit()

    # Mapping rapide des équipes par nom
    team_dict = {t.name: t for t in db.query(Team).all()}

    # 3. Matchs FFSU
    matches = [
        UniversityMatch(
            team_id=team_dict.get("Volley 1").id if "Volley 1" in team_dict else None,
            sport="Volley-ball",
            category="Collectif",
            gender="Mixte",
            competition="Championnat Académique FFSU Lorraine",
            team_home="TELECOM Nancy (Volley 1)",
            team_away="Polytech Nancy",
            match_date="2026-11-05 19:00",
            location="Gymnase SUAPS Nancy Est",
            status="UPCOMING",
            details="Choc pour la 1ère place ! Venez nombreux avec vos t-shirts de l'école."
        ),
        UniversityMatch(
            team_id=team_dict.get("Volley 1").id if "Volley 1" in team_dict else None,
            sport="Volley-ball",
            category="Collectif",
            gender="Mixte",
            competition="Championnat Académique FFSU Lorraine",
            team_home="Mines Nancy",
            team_away="TELECOM Nancy (Volley 1)",
            match_date="2026-10-22 20:00",
            location="Gymnase Chopin (Nancy Thermal)",
            status="COMPLETED",
            score_home=1,
            score_away=3,
            details="Grande victoire à l'extérieur 25-22, 21-25, 25-18, 25-23 !"
        ),
        UniversityMatch(
            team_id=team_dict.get("Volley F").id if "Volley F" in team_dict else None,
            sport="Volley-ball",
            category="Collectif",
            gender="Féminin",
            competition="Championnat Académique Féminin FFSU",
            team_home="EEIGM Nancy",
            team_away="TELECOM Nancy (Volley F)",
            match_date="2026-10-24 18:30",
            location="Gymnase Jacquet (Nancy)",
            status="COMPLETED",
            score_home=0,
            score_away=3,
            details="Match maîtrisé de bout en bout (25-18, 25-14, 25-20) !"
        ),
        UniversityMatch(
            team_id=team_dict.get("Volley 2").id if "Volley 2" in team_dict else None,
            sport="Volley-ball",
            category="Collectif",
            gender="Mixte",
            competition="Championnat FFSU Lorraine - Poule B",
            team_home="TELECOM Nancy (Volley 2)",
            team_away="ENSIC Nancy",
            match_date="2026-11-12 18:30",
            location="Gymnase SUAPS Nancy Est",
            status="UPCOMING",
            details="Deuxième journée de championnat pour la Volley 2."
        ),
        UniversityMatch(
            team_id=team_dict.get("Volley 3").id if "Volley 3" in team_dict else None,
            sport="Volley-ball",
            category="Collectif",
            gender="Mixte",
            competition="Critérium FFSU Lorraine",
            team_home="TELECOM Nancy (Volley 3)",
            team_away="IUT Nancy-Brabois",
            match_date="2026-11-19 19:00",
            location="Gymnase Chopin",
            status="UPCOMING",
            details="Premier match officiel de la Volley 3 cette saison."
        ),
        UniversityMatch(
            team_id=team_dict.get("Basket 1").id if "Basket 1" in team_dict else None,
            sport="Basket-ball",
            category="Collectif",
            gender="Mixte",
            competition="Championnat Académique FFSU Lorraine",
            team_home="TELECOM Nancy (Basket 1)",
            team_away="ENSEM Nancy",
            match_date="2026-10-20 20:00",
            location="Gymnase Bazin (Nancy)",
            status="COMPLETED",
            score_home=68,
            score_away=62,
            details="Fin de match haletante avec deux 3-points décisifs d'Antoine !"
        ),
        UniversityMatch(
            team_id=team_dict.get("Foot 1").id if "Foot 1" in team_dict else None,
            sport="Football",
            category="Collectif",
            gender="Mixte",
            competition="Championnat Universitaire de Football",
            team_home="TELECOM Nancy (Foot 1)",
            team_away="STAPS Nancy",
            match_date="2026-10-15 14:30",
            location="Stade Matter (Nancy)",
            status="COMPLETED",
            score_home=3,
            score_away=1,
            details="Doublé d'Antoine et frappe téléguidée de Julien en pleine lucarne."
        ),
        UniversityMatch(
            team_id=team_dict.get("Rugby XV").id if "Rugby XV" in team_dict else None,
            sport="Rugby",
            category="Collectif",
            gender="Mixte",
            competition="Tournoi Universitaire Lorraine",
            team_home="TELECOM Nancy (Rugby)",
            team_away="Mines Nancy",
            match_date="2026-11-26 15:00",
            location="Terrain de Brabois",
            status="UPCOMING",
            details="Derby classique des écoles d'ingénieurs nancéiennes."
        ),
        UniversityMatch(
            team_id=team_dict.get("Badminton Indiv").id if "Badminton Indiv" in team_dict else None,
            sport="Badminton",
            category="Individuel",
            gender="Mixte",
            competition="Championnat Académique Individuel FFSU",
            team_home="TELECOM Nancy (Badminton)",
            team_away="Faculté des Sciences",
            match_date="2026-11-18 14:00",
            location="Gymnase SUAPS Nancy Est",
            status="UPCOMING",
            details="Poules individuelles simples hommes, simples dames et doubles mixtes."
        ),
    ]
    db.add_all(matches)
    db.commit()

    # 4. Exemples d'emprunts avec mails @telecomnancy.net
    eq_volley = db.query(Equipment).filter(Equipment.name.like("%Volley%")).first()
    eq_chasuble = db.query(Equipment).filter(Equipment.name.like("%Rouge%")).first()
    eq_badminton = db.query(Equipment).filter(Equipment.name.like("%Badminton%")).first()

    loans = [
        EquipmentLoan(
            equipment_id=eq_volley.id if eq_volley else 1,
            user_name="Thomas Martin",
            user_email="thomas.martin@telecomnancy.net",
            user_phone="06 12 34 56 78",
            quantity=2,
            loan_date="2026-11-02",
            expected_return_date="2026-11-05",
            status="APPROVED",
            notes="Entraînement de la Volley 1 pour préparer le match contre Polytech",
            admin_notes="Matériel remis au local BDS par Antoine"
        ),
        EquipmentLoan(
            equipment_id=eq_chasuble.id if eq_chasuble else 4,
            user_name="Camille Durand",
            user_email="camille.durand@telecomnancy.net",
            user_phone="06 98 76 54 32",
            quantity=1,
            loan_date="2026-11-06",
            expected_return_date="2026-11-07",
            status="PENDING",
            notes="Tournoi interne inter-promos 1A vs 2A"
        ),
        EquipmentLoan(
            equipment_id=eq_badminton.id if eq_badminton else 6,
            user_name="Lucas Bernard",
            user_email="lucas.bernard@telecomnancy.net",
            user_phone="06 45 67 89 01",
            quantity=2,
            loan_date="2026-10-20",
            expected_return_date="2026-10-23",
            actual_return_date="2026-10-23",
            status="RETURNED",
            notes="Séance libre jeudi midi au gymnase",
            admin_notes="Matériel restitué complet et en parfait état"
        )
    ]
    db.add_all(loans)
    db.commit()

    # 5. Tournois inter-écoles (ex: TOSS)
    toss = Tournament(
        name="TOSS 2026 - CentraleSupélec",
        edition="36ème Édition",
        location="Campus CentraleSupélec (Gif-sur-Yvette)",
        start_date="2026-05-15",
        end_date="2026-05-17",
        description="Le plus grand tournoi omnisports étudiant de France rassemblant plus de 4 500 athlètes de 50 écoles et universités.",
        overall_ranking="4ème au classement général des écoles (sur 48)",
        image_url="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80"
    )
    db.add(toss)
    db.commit()

    toss_results = [
        TournamentResult(
            tournament_id=toss.id,
            sport="Volley-ball Féminin",
            team_name="TELECOM Nancy (Volley F)",
            ranking_position="Médaille de Bronze (3ème place)",
            medal="BRONZE",
            summary="Victoire haletante 2-1 (15-13 au tie-break) en petite finale contre Centrale Lille !"
        ),
        TournamentResult(
            tournament_id=toss.id,
            sport="Football Mixte",
            team_name="TELECOM Nancy (Foot 1)",
            ranking_position="Médaille d'Argent (Finaliste)",
            medal="SILVER",
            summary="Un parcours héroïque avec 4 victoires d'affilée avant de s'incliner 1-2 en finale contre Polytechnique."
        ),
        TournamentResult(
            tournament_id=toss.id,
            sport="Basket-ball Mixte",
            team_name="TELECOM Nancy (Basket 1)",
            ranking_position="Quart de finaliste",
            medal="NONE",
            summary="Sortie 1ère de poule avec 3 victoires, élimination de 3 points en prolongation face à l'INSA Lyon."
        )
    ]
    db.add_all(toss_results)

    coupe_x = Tournament(
        name="Coupe de l'X 2026",
        edition="Édition Printemps",
        location="École Polytechnique (Palaiseau)",
        start_date="2026-04-10",
        end_date="2026-04-12",
        description="Tournoi multisports emblématique sur le plateau de Saclay avec plus de 20 délégations participantes.",
        overall_ranking="5ème / 25 délégations",
        image_url="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80"
    )
    db.add(coupe_x)
    db.commit()

    coupe_x_results = [
        TournamentResult(
            tournament_id=coupe_x.id,
            sport="Volley-ball Mixte",
            team_name="TELECOM Nancy (Volley 1)",
            ranking_position="Champion (Médaille d'Or)",
            medal="GOLD",
            summary="Parcours sans faute, aucune manche concédée jusqu'à la victoire 2-0 contre l'ESCP en finale !"
        )
    ]
    db.add_all(coupe_x_results)
    db.commit()

    # 6. Événements sportifs à Nancy
    events = [
        NancyEvent(
            title="Blablarun Nancy 2026",
            category="Course solidaire & conviviale",
            event_date="2026-11-15 10:00",
            location="Parc de la Pépinière, Nancy",
            description="La course nancéienne chaleureuse où sport et rencontre se mélangent ! Parcours de 5 km et 10 km au cœur du parc de la Pépinière. Le BDS TELECOM Nancy négocie un tarif spécial et finance 50% du dossard !",
            bds_participation=True,
            price_info="5€ adhérents BDS (au lieu de 12€)",
            registration_link="https://blablarun.fr",
            image_url="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80",
            is_featured=True
        ),
        NancyEvent(
            title="24 Heures de Stan 2026",
            category="Fête étudiante & Relais de chars",
            event_date="2026-05-23 14:00",
            location="Place Carrière & Place Stanislas, Nancy",
            description="La plus grande manifestation étudiante de l'Est de la France ! Plus de 40 000 spectateurs réunis autour d'une course de chars artisanaux non-stop pendant 24h, avec défis sportifs et concerts.",
            bds_participation=True,
            price_info="Entrée gratuite (Équipage TELECOM Nancy soutenu par l'école)",
            registration_link="https://24heuresdestan.fr",
            image_url="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
            is_featured=True
        ),
        NancyEvent(
            title="Nuit du Volley SUAPS Nancy",
            category="Tournoi nocturne étudiant",
            event_date="2026-11-26 19:30",
            location="Complexe Sportif Universitaire SUAPS Brabois",
            description="Le tournoi 4x4 mixte incontournable de la rentrée ! 32 équipes étudiantes, ambiance musicale avec DJ, crêpes & buvette toute la nuit.",
            bds_participation=True,
            price_info="Gratuit pour les étudiants",
            registration_link="https://sport.univ-lorraine.fr",
            image_url="https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&auto=format&fit=crop&q=80",
            is_featured=True
        ),
        NancyEvent(
            title="Semi-Marathon & 10km du Grand Nancy",
            category="Course sur route FFA",
            event_date="2026-10-04 09:00",
            location="Départ Place Stanislas, Nancy",
            description="Le grand rendez-vous running nancéien traversant la Place Stanislas, la vieille ville et les quais de Meurthe.",
            bds_participation=True,
            price_info="12€ étudiant via commande groupée BDS",
            registration_link="https://semidenancy.fr",
            image_url="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80",
            is_featured=False
        )
    ]
    db.add_all(events)
    db.commit()
