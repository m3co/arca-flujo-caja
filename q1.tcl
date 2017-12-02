
namespace eval fnCostTasks1 {
  variable rows
  variable frame
  variable project
  array set rows {}

  proc open { space id } {
    variable frame $space
    variable project $id
    array set event [list \
      query select \
      module fnCostTasks1 \
      from fnCostTasks1 \
      project $id
    ]
    chan puts $MAIN::chan [array get event]
  }

  proc 'do'download { resp } {
    return "await-next"
  }

  proc 'do'download'next { data } {
    puts "aqui comenzamos"
    set out [open "report.xlsx" w+]
    puts "esto es $out"
    puts $out $data
    close $out
  }

  proc 'do'update { resp } {
    variable frame
    variable project
    upvar $resp response
    array set row [deserialize $response(row)]
    variable rows
    array set rows [list $row(id) $response(row)]
  }

  proc 'do'insert { resp } {
    upvar $resp response
    array set row [deserialize $response(row)]

    if { $row(project) != $project } {
      return
    }
    'do'select response
  }

  proc 'do'select { resp } {
    variable frame
    upvar $resp response
    array set row [deserialize $response(row)]
    variable rows
    array set rows [list $row(id) $response(row)]
  }
}
