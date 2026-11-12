# Build the CV with XeLaTeX (or Tectonic) and publish it to public/assets/.
#   make        -> build/cv_hector_carrion.pdf, copied to ../public/assets/cv_hector_carrion.pdf
#   make clean  -> remove build files

NAME := cv_hector_carrion

all: ../public/assets/$(NAME).pdf

../public/assets/$(NAME).pdf: build/$(NAME).pdf
	mkdir -p ../public/assets
	cp $< $@

build/$(NAME).pdf: $(NAME).tex hf_icon.pdf
	mkdir -p build
	@if command -v tectonic >/dev/null 2>&1; then \
		tectonic $(NAME).tex -o build; \
	else \
		latexmk -xelatex -interaction=nonstopmode -halt-on-error -outdir=build $(NAME).tex; \
	fi

clean:
	rm -rf build

.PHONY: all clean
