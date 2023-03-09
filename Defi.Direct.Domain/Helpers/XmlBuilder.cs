using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;

namespace Elements.Domain
{
	public class XmlBuilder
	{
		private string _xml = "";
		private XmlSchema _schema;
		private IDictionary<string, object> _container;
		private DataSet _dataset;
		private string _rootName;
		private string[] _filteredFields;
		public XmlBuilder(IDictionary<string, object> container, string rootName = "root", string[] filteredFields = null)
		{
			_container = container;
			_rootName = rootName;
			_filteredFields = filteredFields ?? new string[] { };
			BuildSchema();
		}
		private void BuildSchema()
		{
			_dataset = BuildTable();
			_xml = _dataset.GetXml();
			TextReader xmlTextReader = new StringReader(_xml);
			XmlReader reader = XmlReader.Create(xmlTextReader);
			XmlSchemaInference schemaInference = new XmlSchemaInference();
			var schemaSet = schemaInference.InferSchema(reader);
			foreach (XmlSchema xmlSchema in schemaSet.Schemas())
			{
				schemaSet.Reprocess(xmlSchema);
				schemaSet.Compile();
				_schema = xmlSchema;
				break;
			}
		}


		private DataSet BuildTable()
		{
			DataSet rootDataset = new DataSet(_rootName);
			// rootDataset.Namespace = "http://www.w3.org/2001/XMLSchema-instance";


			DataTable containerTable = new DataTable("Data");
			rootDataset.Tables.Add(containerTable);

			List<object> values = new List<object>();
			foreach (var field in _container.OrderBy(i => i.Key))
			{
				var exclude = false;
				foreach (var filtered in _filteredFields)
				{
					if (filtered.Contains("%"))
					{
						var wildCardValue = filtered.Replace("%", "");
						if (field.Key.ToLower().Contains(wildCardValue.ToLower()))
							exclude = true;
					}
					else
					{
						if (field.Key.Equals(filtered, StringComparison.OrdinalIgnoreCase))
							exclude = true;
					}
				}

				if (exclude)
					continue;



				Type fieldType = field.Value.GetType();
				var column = CreateColumn(field.Key, fieldType);
				containerTable.Columns.Add(column);
				values.Add(field.Value);
			}

			containerTable.Rows.Add(values.ToArray());

			return rootDataset;
		}

		private DataColumn CreateColumn(string fieldName, Type fieldType)
		{

			return new DataColumn(fieldName,
				fieldType,
				null,
				MappingType.Element);
		}




		public bool ValidateXml(string xml)
		{
			try
			{
				XmlSchemaSet schemaSet = new XmlSchemaSet();

				schemaSet.Add(_schema);
				schemaSet.Compile();
				XmlReaderSettings settings = new XmlReaderSettings();
				settings.Schemas.Add(schemaSet);
				TextReader xmlTextReader = new StringReader(xml);
				settings.ValidationType = ValidationType.Schema;

				XmlReader xmlReader = XmlReader.Create(xmlTextReader, settings);
				XmlDocument doc = new XmlDocument();

				doc.Load(xmlReader);
			}
			catch (Exception)
			{
				return false;
			}

			return true;
		}

		public string GetXml()
		{
			return _xml;
		}

		public XmlSchema GetSchema()
		{
			return _schema;
		}

		public DataSet GetDataSet()
		{
			return _dataset;
		}

		public static void Format(XDocument xdoc)
		{
			XElement accountNode = xdoc.Root.Elements().First();
			List<XElement> accountChildren = new List<XElement>();

			foreach (XElement child in xdoc.Root.Elements())
			{
				if (child.Name != accountNode.Name)
				{
					accountChildren.Add(child);
				}
			}
			foreach (var accountChild in accountChildren)
			{
				accountNode.Add(new XElement(accountChild));
				accountChild.Remove();
			}

			xdoc.Root.ReplaceWith(new XElement(accountNode));
		}
	}


}
