from django.test import TestCase

# Create your tests here.








#  Create a new Document
#     doc = Document()

#     Add a title
#     doc.add_heading('KPI Report', level=1)

#     # Add tables for each strategic goal
#     for strategic_goal in table_data:
#         doc.add_heading(strategic_goal['strategic_goal_name'], level=2)
        
#         for main_goal in strategic_goal['main_goals']:
#             doc.add_heading(main_goal['main_goal_name'], level=3)
            
#             # Create a table
#             table = doc.add_table(rows=1, cols=5)
#             hdr_cells = table.rows[0].cells
#             hdr_cells[0].text = 'KPI Name'
#             hdr_cells[1].text = 'measure'
#             hdr_cells[2].text = 'Initial'
#             hdr_cells[3].text = 'Plan'
#             hdr_cells[4].text = 'Performance'
#             hdr_cells[5].text = 'Percent'
            
#             for kpi in main_goal['kpis']:
#                 row_cells = table.add_row().cells
#                 row_cells[0].text = kpi['kpi_name']
#                 row_cells[1].text = str(kpi['measure'])
#                 row_cells[1].text = str(kpi['initial'])
#                 row_cells[2].text = str(kpi['plan'])
#                 row_cells[3].text = str(kpi['performance'])
#                 row_cells[4].text = str(kpi['percent'])



















#                 table = doc.add_table(rows=1, cols=6)
#                 hdr_cells = table.rows[0].cells

#                 # Set the table headers
#                 headers = [
#                     'ስትራቴጂክ ግቦች፣ ዋና ዋና ተግባራት እና ዝርዝር ቁልፍ የአፈፃፀም አመልካቾች',
#                     'መለኪያ', 'መነሻ', 'ግብ', 'አፈጻጸም', 'አፈጻጸም በመቶኛ'
#                 ]
#                 column_widths = [5, 2, 2, 2, 2, 2]

#                 # Set header text, width, and style
#                 for i, (header, width) in enumerate(zip(headers, column_widths)):
#                     hdr_cells[i].text = header
#                     hdr_cells[i].width = Inches(width)
#                     for paragraph in hdr_cells[i].paragraphs:
#                         set_paragraph_style(paragraph, bold=True)
#                     set_cell_border(
#                         hdr_cells[i],
#                         top={"sz": 6, "val": "single", "color": "000000"},
#                         bottom={"sz": 6, "val": "single", "color": "000000"},
#                         left={"sz": 6, "val": "single", "color": "000000"},
#                         right={"sz": 6, "val": "single", "color": "000000"}
#                     )

#                 # Add data rows
#                 for strategic_goal in table_data:
#                     # Add a row for the strategic goal name
#                     strategic_row = table.add_row().cells
#                     strategic_row[0].text = strategic_goal['strategic_goal_name']
#                     strategic_row[0].merge(strategic_row[5])  # Merge the cells for the strategic goal name
#                     for paragraph in strategic_row[0].paragraphs:
#                         set_paragraph_style(paragraph, bold=True)
#                     set_cell_shading(strategic_row[0], 'ADD8E6')  # Light blue background
#                     set_cell_border(
#                         strategic_row[0],
#                         top={"sz": 6, "val": "single", "color": "000000"},
#                         bottom={"sz": 6, "val": "single", "color": "000000"},
#                         left={"sz": 6, "val": "single", "color": "000000"},
#                         right={"sz": 6, "val": "single", "color": "000000"}
#                     )

#                     for main_goal in strategic_goal['main_goals']:
#                         # Add a row for the main goal name
#                         main_goal_row = table.add_row().cells
#                         main_goal_row[0].text = main_goal['main_goal_name']
#                         main_goal_row[0].merge(main_goal_row[5])  # Merge the cells for the main goal name
#                         for paragraph in main_goal_row[0].paragraphs:
#                             set_paragraph_style(paragraph, bold=True)
#                         set_cell_shading(main_goal_row[0], 'D3D3D3')  # Gray background
#                         set_cell_border(
#                             main_goal_row[0],
#                             top={"sz": 6, "val": "single", "color": "000000"},
#                             bottom={"sz": 6, "val": "single", "color": "000000"},
#                             left={"sz": 6, "val": "single", "color": "000000"},
#                             right={"sz": 6, "val": "single", "color": "000000"}
#                         )

#                         # Add rows for KPIs
#                         for kpi in main_goal['kpis']:
#                             kpi_row = table.add_row().cells
#                             kpi_row[0].text = kpi['kpi_name']
#                             kpi_row[1].text = str(kpi['measure'])
#                             kpi_row[2].text = str(kpi['initial'])
#                             kpi_row[3].text = str(kpi['plan'])
#                             kpi_row[4].text = str(kpi['performance'])
#                             kpi_row[5].text = str(kpi['percent'])

#                             # Set column widths for data rows
#                             for i, width in enumerate(column_widths):
#                                 kpi_row[i].width = Inches(width)
                            
#                             for cell in kpi_row:
#                                 for paragraph in cell.paragraphs:
#                                     set_paragraph_style(paragraph)
#                                 set_cell_border(
#                                     cell,
#                                     top={"sz": 6, "val": "single", "color": "000000"},
#                                     bottom={"sz": 6, "val": "single", "color": "000000"},
#                                     left={"sz": 6, "val": "single", "color": "000000"},
#                                     right={"sz": 6, "val": "single", "color": "000000"}
#                                 )
