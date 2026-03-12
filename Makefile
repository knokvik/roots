.PHONY: install run test demo

install:
	pip install -r requirements.txt

run:
	uvicorn src.main:app --reload

test:
	pytest tests/

demo:
	python demo/run_demo.py
