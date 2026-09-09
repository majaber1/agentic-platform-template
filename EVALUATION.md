# AI Evaluation Standard

Required evaluation categories:
1. structural correctness
2. tool selection
3. source selection
4. grounding/evidence faithfulness
5. entity resolution
6. failure handling
7. hallucination resistance
8. bilingual behavior where applicable
9. latency
10. cost/call count

For each material workflow define a golden scenario with user request, expected/forbidden tools, source priority, expected structured output, persistence expectation, acceptable latency, and pass/fail criteria.

No material AI behavior is promoted without a reproducible evaluation set, recorded result, known failures, and regression baseline.
