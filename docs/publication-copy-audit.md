# Publication copy audit

Reviewed 2026-10-18. This record supports the `summary` and `highlight` fields in
`src/pages/articles/*.mdx`.

## Scope and source versions

Read the full main text of all ten papers, including methods, results, captions,
tables available in the retrieved text, discussion, and limitations. Also read the
appendices included in TARDIS STRIDE v3. This was a review of the reported
evidence, not an independent reproduction of the experiments or a comprehensive
audit of separate supplementary files.

The earlier copy had been based on existing abstracts and metadata plus selected
primary sources. It had not received this full-text review.

Publisher/author PDFs were read for cgDDI, Automatic Wound Detection, Honeybee
Re-identification, both fluoxetine-device papers, and the fluorescent-camera
paper. Full arXiv manuscripts were read for DermDepth (v1), FEDD (v1), HealNet
(v2), and TARDIS STRIDE (v3). The publisher PDFs for DermDepth and FEDD could not
be retrieved; those two reviews therefore verify the arXiv manuscripts, not a
page-for-page match with their final proceedings versions.

## Evidence and editorial decisions

| Publication | Full text reviewed | Result location | Copy decision and bounds |
| --- | --- | --- | --- |
| cgDDI | [MICCAI paper, 11 pages](https://papers.miccai.org/miccai-2026/paper/1473_paper.pdf) | Sections 3–4; Table 2, p. 7 | 266,136 synthetic images. The synthetic-pretraining plus real-fine-tuning experiment reports 90.9% DDI malignancy accuracy and 86.6% EOM, compared with PatchAlign's 87.4% accuracy and 69.6% EOM under the stated five-fold protocol. Preserve the real-data fine-tuning condition; avoid claiming superiority on every fairness measure (DPM is lower). |
| DermDepth | [arXiv:2607.13010v1, full manuscript](https://arxiv.org/html/2607.13010v1) | Sections 2.2, 3.1–3.2; Table 2 | Use the table's exact SKINL2 scale ratio, 16.10 to 1.11 after synthetic-only training. This is a predicted/true depth ratio with an ideal value of 1, not a generic error percentage. It differs from the abstract's “under 1.1” wording. The model tunes 2.1M parameters (0.6%); later real-data training produces different ratios. Do not imply demonstrated diagnostic accuracy or broad clinical validation. |
| TARDIS STRIDE | [arXiv:2506.11302v3, full manuscript and appendices](https://arxiv.org/html/2506.11302v3) | Section 4.2; Figure 4; Appendices A, D, G | Reported 60% of geolocation predictions within 10m. Keep the STRIDE/San Mateo evaluation scope; this is sequential, locally bounded georeferencing, not worldwide single-image localization. The architecture has 1B parameters. Replace the generic release highlight with the actual geolocation result. Avoid sequence-count claims because the introduction and Table 1 use inconsistent descriptions of projected images versus sequences. |
| FEDD | [arXiv:2307.11654v1, full manuscript](https://arxiv.org/html/2307.11654v1) | Abstract; Sections 2, 3, 4 | The abstract reports 81% malignancy accuracy at the approximately 10% DDI setting. Section 2 defines that training subset as 20 images per each of three skin-tone groups, or 60 labeled images. The diffusion backbone is frozen. Describe the downstream MLPs as lightweight prediction heads; avoid suggesting they are strictly linear or that the entire model learned from only 60 images. |
| HealNet | [arXiv:2206.10536v2, 10 pages](https://arxiv.org/pdf/2206.10536) | Sections 2–4; Tables 2–3 | Use the table-rounded 90.6% test accuracy and specify the cluster-derived stage labels. The held-out single-image test set has 32 images from two wounds. Training does not use manual stage annotations; later human-agreement analysis is a separate evaluation. Do not present this as 90.6% accuracy against independent clinical stage diagnoses. |
| Automatic Wound Detection | [PLOS full paper, 26 pages](https://journals.plos.org/ploscompbiol/article/file?id=10.1371/journal.pcbi.1009852&type=printable) | Dataset and post-processing sections; Table 1, p. 13; discussion | U-Net test Dice increases from 67.85% to 86.65% with post-processing. This is wound-and-splint segmentation, not an accuracy percentage for physical area measurements. The 256-image dataset spans 16 mouse wounds; only 75% is training data. Size trajectories preserve useful trends despite differing wound-edge conventions. Use the measured test improvement as the highlight instead of the dataset size alone. |
| Honeybee Re-identification | [Author-hosted proceedings PDF, 9 pages](https://jachansantiago.com/assets/pdf/VISAPP.pdf) | Sections 3–5; Table 2, proceedings p. 523 | Best combined training reaches 0.624 rank-1 for different-day/any-hour queries. Each gallery has one positive and ten distractors. The network sees abdomen crops, excluding the tags used to obtain identity ground truth. Retain the 11-image gallery condition; do not imply 62.4% identification across an entire colony or that no tags were used in dataset construction. |
| Programmable Fluoxetine Delivery | [UC-hosted publisher PDF, 10 article pages plus cover](https://escholarship.org/content/qt5pc6c3xp/qt5pc6c3xp.pdf) | Results and Discussion; Figures 3I and 4C; Experimental Section | At day 3, treated mouse wounds show 39.9% greater re-epithelialization and 27.2% lower M1/M2 ratio than controls wearing unpowered devices. These are relative changes, not percentage-point changes. Wound area itself did not differ significantly. Preserve the early-stage mouse proof-of-concept scope; do not claim a demonstrated reduction in total healing time or human benefit. |
| Remote-Controlled Bioelectronics | [UC-hosted publisher PDF, 8 article pages plus cover](https://escholarship.org/content/qt7fx4b64k/qt7fx4b64k.pdf) | Section 1.3; Figure 5B–E; conclusion | At day 3, porcine wounds show 37% greater re-epithelialization and 33% lower M1/M2 ratio than standard-care controls. These are relative changes in early wound repair, not completed-healing outcomes. Keep the porcine and day-three conditions. Seven-day outcomes were not statistically significant in the small sample; do not extend the headline to them or to chronic human wounds. |
| Modular Fluorescent Camera | [Nature publisher PDF, 12 pages](https://www.nature.com/articles/s42003-025-08423-y.pdf) | NO detection section; Figure 5; Table 3; Statistics and reproducibility | NO analysis uses eight wounds from four mice, sampled at days 3–6. Brighter high-NO regions and smaller high-NO areas relate to later days and greater histological re-epithelialization. Phrase this as an association across samples, not longitudinal shrinkage of a tracked cluster or a causal effect. Avoid turning normalized regression MSE into a clinical accuracy claim; the paper describes a small proof of concept without replication. |

## Display checks

All ten publications retain a bold highlight on the archive and their detail
pages. The same reviewed metadata supplies the three selected homepage cards,
detail-page SEO descriptions, and RSS summaries. Existing paper/resource links
remain available beside each publication.
