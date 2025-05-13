#!/usr/bin/env python3
"""
Script pour détecter et remplacer les motifs de date dans les identifiants CVE et les termes de terme.txt.
Remplace les années (ex: 2018) par [[year]] dans les chaînes d'identifiants CVE et les termes par [[term]].
Supprime les fichiers contenant certaines chaînes de caractères.
"""

import os
import re
import glob

def load_terms():
    """Charge les termes depuis le fichier terme.txt."""
    try:
        with open('terme.txt', 'r', encoding='utf-8') as file:
            return [line.strip() for line in file if line.strip()]
    except FileNotFoundError:
        print("Attention: terme.txt non trouvé")
        return []

def replace_cve_dates(file_path, terms):
    """Remplace les motifs de date et les termes dans les identifiants CVE d'un fichier."""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Vérifier si le fichier contient des chaînes à supprimer
    if "description : rejected" in content.lower() or "Rejected reason: ** REJECT ** DO NOT USE THIS CANDIDATE NUMBER" in content:
        os.remove(file_path)
        print(f"Fichier supprimé: {file_path}")
        return
    
    # Pattern pour matcher "CVE ID : CVE-YYYY-" ou motifs similaires
    pattern = r'(CVE ID\s*:\s*CVE-)(20\d{2})(-)'
    
    # Remplacer la partie année par [[year]] tout en capturant l'année réelle
    modified_content = re.sub(pattern, lambda m: f'{m.group(1)}[[{m.group(2)}]]{m.group(3)}', content)
    
    # Remplacer les termes de terme.txt
    for term in terms:
        # Nettoyer le terme des crochets existants
        clean_term = term.replace('[[', '').replace(']]', '')
        # Pattern qui ignore les termes déjà entre crochets
        term_pattern = re.compile(r'(?<!\[\[)\b' + re.escape(clean_term) + r'\b(?!\]\])')
        modified_content = term_pattern.sub(f'[[{clean_term}]]', modified_content)
    
    if content != modified_content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        print(f"Mis à jour: {file_path}")
    else:
        print(f"Aucun changement nécessaire: {file_path}")

def main():
    # Charger les termes depuis terme.txt
    terms = load_terms()
    
    # Obtenir tous les fichiers markdown dans le répertoire CVE et ses sous-répertoires
    cve_files = glob.glob('source/CVE/**/*.md', recursive=True)
    
    for file_path in cve_files:
        replace_cve_dates(file_path, terms)
    
    print(f"Traitement de {len(cve_files)} fichiers terminé")

if __name__ == "__main__":
    main()